import { GoogleGenAI, Type, Modality } from '@google/genai';
import { SYSTEM_PROMPT, INITIAL_LANDMARKS } from '../constants';
import {
  QuestResponse,
  Coordinates,
  ChatMessage,
  ItineraryRequest,
  ItineraryItem,
} from '../types';

// --- CONFIGURATION ---
// In DEV mode, this key is available (from vite.config.ts).
// In PROD mode, this is empty, but we won't use it because we call the backend.
const API_KEY = process.env.API_KEY;

// --- AUDIO CACHE ---
const audioCache = new Map<string, string>();

// --- HELPERS ---
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
    throw new Error('Failed to decode audio data.');
  }
}

export function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000
): AudioBuffer {
  if (data.length % 2 !== 0) data = data.slice(0, data.length - 1);
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

// --- NATIVE TTS FALLBACK ---
export const speakNative = (
  text: string,
  lang: string = 'en-US'
): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Google') && v.lang.includes('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};

export const stopNativeSpeech = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};

// --- SECURE BACKEND CALLER (PROD) ---
const callBackend = async (endpoint: string, body: any) => {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Call Error (${endpoint}):`, error);
    throw error;
  }
};

// --- HYBRID FUNCTIONS (DEV LOCAL / PROD SERVER) ---

export const planItinerary = async (
  req: ItineraryRequest
): Promise<ItineraryItem[]> => {
  // DEV MODE: Run locally
  if (import.meta.env.DEV) {
    console.log('⚡ [DEV] Planning Itinerary locally...');
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    const availableLandmarks = INITIAL_LANDMARKS.map((l) => ({ name: l.name }));
    const prompt = `Create a ${
      req.duration
    } itinerary for Kutaisi. Vibe: ${req.vibe.join(
      ', '
    )}. Priority: ${JSON.stringify(availableLandmarks)}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: {
                type: Type.STRING,
                enum: ['walk', 'visit', 'eat', 'photo'],
              },
              landmarkId: { type: Type.STRING, nullable: true },
              icon: { type: Type.STRING },
            },
            required: ['time', 'title', 'description', 'type', 'icon'],
          },
        },
      },
    });
    return JSON.parse(response.text || '[]');
  }

  // PROD MODE: Call Server
  const availableLandmarks = INITIAL_LANDMARKS.map((l) => ({
    id: l.id,
    name: l.name,
    category: l.category,
    desc: l.description,
  }));
  const data = await callBackend('plan', { request: req, availableLandmarks });
  return data.itinerary;
};

export const chatWithLegend = async (
  legendName: string,
  legendBio: string,
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  // DEV MODE
  if (import.meta.env.DEV) {
    console.log('⚡ [DEV] Chatting locally...');
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    const systemInstruction = `You are acting as ${legendName}. Bio: ${legendBio}. Keep responses under 3 sentences. Be warm and archaic.`;
    // Simple stateless chat for dev
    const context = history
      .map(
        (h: any) => `${h.role === 'user' ? 'Traveler' : legendName}: ${h.text}`
      )
      .join('\n');
    const fullPrompt = `${systemInstruction}\n\nHistory:\n${context}\n\nTraveler: ${newMessage}\n${legendName}:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: fullPrompt }] }],
    });
    return response.text || '...';
  }

  // PROD MODE
  const data = await callBackend('chat', {
    legendName,
    legendBio,
    history,
    newMessage,
  });
  return data.reply;
};

export const generateAudioGuide = async (
  landmarkName: string,
  shortDescription: string
): Promise<string> => {
  const cacheKey = `guide:${landmarkName}`;
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey)!;

  let audioData = '';

  if (import.meta.env.DEV) {
    console.log('⚡ [DEV] Generating TTS locally...');
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [
        {
          parts: [
            {
              text: `Gamarjoba! Welcome to ${landmarkName}. ${shortDescription}`,
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    audioData =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
  } else {
    const data = await callBackend('tts', {
      text: `Gamarjoba! Welcome to ${landmarkName}. ${shortDescription}`,
      type: 'guide',
    });
    audioData = data.audio;
  }

  if (audioData) audioCache.set(cacheKey, audioData);
  return audioData;
};

export const generatePhraseAudio = async (phrase: string): Promise<string> => {
  const cacheKey = `phrase:${phrase}`;
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey)!;

  let audioData = '';

  if (import.meta.env.DEV) {
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Please pronounce: "${phrase}"` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    audioData =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
  } else {
    const data = await callBackend('tts', {
      text: `Please pronounce: "${phrase}"`,
      phrase,
      type: 'phrase',
    });
    audioData = data.audio;
  }

  if (audioData) audioCache.set(cacheKey, audioData);
  return audioData;
};

export const identifyLandmark = async (
  base64Image: string,
  userLocation: Coordinates
): Promise<QuestResponse> => {
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  // DEV MODE: Run locally
  if (import.meta.env.DEV) {
    console.log('⚡ [DEV] Identifying locally...');
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    const prompt = `
            Role: You are "GeoQuest AI", a strict judge of locations in Kutaisi, Georgia.
            User GPS: Lat ${userLocation.lat}, Lng ${userLocation.lng}.
            Task: Identify if the image matches a known landmark at these coordinates.
            Output: JSON only.
        `;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
            { text: prompt },
          ],
        },
        config: {
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
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error('Local Identity Error:', error);
      return {
        location_confirmed: false,
        place_name: 'AI Error',
        story: 'Could not analyze image locally.',
        points_earned: 0,
        next_quest_hint: 'Try again.',
      };
    }
  }

  // PROD MODE: Secure Server Call
  try {
    const data = await callBackend('identify', {
      image: cleanBase64,
      userLocation,
    });
    return data;
  } catch (error) {
    return {
      location_confirmed: false,
      place_name: 'Connection Error',
      story: 'Could not connect to secure server.',
      points_earned: 0,
      next_quest_hint: 'Try again later.',
    };
  }
};
