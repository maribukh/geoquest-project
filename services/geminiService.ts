import { GoogleGenAI, Type } from '@google/genai';
import { SYSTEM_PROMPT } from '../constants';
import { QuestResponse, Coordinates } from '../types';

// --- AUDIO CACHE ---
// Stores generated audio to prevent hitting API Rate Limits (429) on repeated clicks
const audioCache = new Map<string, string>();

// --- AUDIO DECODING HELPERS ---

export function base64ToUint8Array(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error('Base64 decode failed', e);
    throw new Error('Failed to decode audio data from AI.');
  }
}

export function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000
): AudioBuffer {
  // SAFETY: Ensure data length is even (Int16 requires 2 bytes per sample)
  if (data.length % 2 !== 0) {
    console.warn('Odd byte length for PCM16, slicing last byte.');
    data = data.slice(0, data.length - 1);
  }

  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    // Normalize Int16 to Float32 [-1.0, 1.0]
    channelData[i] = dataInt16[i] / 32768.0;
  }

  return buffer;
}

// --- NATIVE BROWSER TTS (UNLIMITED FREE FALLBACK) ---
export const speakNative = (
  text: string,
  lang: string = 'en-US'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      // Check for iOS
      console.warn('Speech Synthesis not found directly on window.');
    }

    // Cancel any currently playing speech to start fresh
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;

    // Try to select a better voice if available (e.g., Google US English)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Google') && v.lang.includes('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (e) => {
      console.error('Native Speech Error:', e);
      // resolve anyway to reset UI state so button doesn't get stuck
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};

export const stopNativeSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// --- API CLIENT ---

const getApiKey = () => {
  // 1. Try Vite standard env var
  if (import.meta.env && import.meta.env.VITE_API_KEY) {
    return import.meta.env.VITE_API_KEY;
  }
  // 2. Fallback for process.env (replaced by Vite define)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    // ignore
  }
  return '';
};

const getAiClient = () => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error('❌ GEMINI SERVICE: No API Key found! Check .env file.');
    throw new Error('API Key is missing. Check .env file.');
  }

  return new GoogleGenAI({ apiKey });
};

// --- HELPER: ERROR PARSER ---
const parseGeminiError = (error: any): Error => {
  const msg = error.toString();
  if (
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota')
  ) {
    return new Error('QUOTA_EXCEEDED');
  }
  if (msg.includes('503') || msg.includes('overloaded')) {
    return new Error('AI Model is overloaded. Switching to offline mode.');
  }
  return error;
};

// --- FEATURES ---

export const generateAudioGuide = async (
  landmarkName: string,
  shortDescription: string
): Promise<string> => {
  // 1. Check Cache
  const cacheKey = `guide:${landmarkName}`;
  if (audioCache.has(cacheKey)) {
    console.log('🔊 Playing Audio Guide from Cache ⚡');
    return audioCache.get(cacheKey)!;
  }

  try {
    const ai = getAiClient();
    console.log('🔊 Requesting Audio API for:', landmarkName);

    const promptText = `You are a professional tour guide. Please read the following description clearly and enthusiastically for a tourist: "Gamarjoba! Welcome to ${landmarkName}. ${shortDescription}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        // Use string 'AUDIO' to avoid import issues
        responseModalities: ['AUDIO' as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      const textPart = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textPart)
        console.warn('Model returned text instead of audio:', textPart);
      throw new Error('API returned no audio data. Model might be busy.');
    }

    console.log('✅ Audio Data Received. Caching...');
    audioCache.set(cacheKey, base64Audio); // Save to cache
    return base64Audio;
  } catch (error: any) {
    console.error('Audio Gen Error:', error);
    throw parseGeminiError(error);
  }
};

export const generatePhraseAudio = async (phrase: string): Promise<string> => {
  // 1. Check Cache
  const cacheKey = `phrase:${phrase}`;
  if (audioCache.has(cacheKey)) {
    console.log('🔊 Playing Phrase from Cache ⚡');
    return audioCache.get(cacheKey)!;
  }

  try {
    const ai = getAiClient();
    console.log('🔊 Requesting Phrase API for:', phrase);

    const promptText = `You are a native Georgian speaker. Please pronounce the following phrase clearly and slowly: "${phrase}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: ['AUDIO' as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResponse) {
        console.warn('⚠️ Model returned text instead of audio:', textResponse);
        throw new Error(`Model returned text: ${textResponse}`);
      }
      throw new Error('API returned no audio data.');
    }

    console.log('✅ Phrase Audio Received. Caching...');
    audioCache.set(cacheKey, base64Audio); // Save to cache
    return base64Audio;
  } catch (error: any) {
    console.error('Phrase Audio Error:', error);
    throw parseGeminiError(error);
  }
};

export const identifyLandmark = async (
  base64Image: string,
  userLocation: Coordinates
): Promise<QuestResponse> => {
  try {
    const ai = getAiClient();
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const locationContext = `
      User GPS Location: Latitude ${userLocation.lat}, Longitude ${userLocation.lng}.
      
      INSTRUCTIONS:
      1. Use the GPS location to narrow down the list of possible landmarks in Kutaisi significantly.
      2. Analyze the image visually.
      3. ONLY confirm the location if the visual image MATCHES the landmark expected at these GPS coordinates.
      4. If the image is just a blurry floor, a selfie, or a generic wall, return location_confirmed: false.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: `Identify this location. ${locationContext}`,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            location_confirmed: { type: Type.BOOLEAN },
            place_name: { type: Type.STRING },
            story: { type: Type.STRING },
            points_earned: { type: Type.INTEGER },
            next_quest_hint: { type: Type.STRING },
          },
          required: [
            'location_confirmed',
            'place_name',
            'story',
            'points_earned',
            'next_quest_hint',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');

    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleanedText) as QuestResponse;
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    return {
      location_confirmed: false,
      place_name: 'Connection Error',
      story: 'Could not connect to AI. Please check your internet.',
      points_earned: 0,
      next_quest_hint: 'Try again later.',
    };
  }
};
