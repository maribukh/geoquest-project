import { GoogleGenAI, Type } from '@google/genai';
import { SYSTEM_PROMPT } from '../constants';
import { QuestResponse, Coordinates } from '../types';

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

// --- FEATURES ---

export const generateAudioGuide = async (
  landmarkName: string,
  shortDescription: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    console.log('🔊 Requesting Audio for:', landmarkName);

    const promptText = `Speak enthusiastically like a tour guide: "Gamarjoba! Welcome to ${landmarkName}. ${shortDescription}"`;

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
    if (!base64Audio)
      throw new Error('API returned no audio data. Model might be busy.');

    console.log('✅ Audio Data Received. Length:', base64Audio.length);
    return base64Audio;
  } catch (error: any) {
    console.error('Audio Gen Error:', error);
    throw error; // Re-throw to be caught by UI
  }
};

export const generatePhraseAudio = async (phrase: string): Promise<string> => {
  try {
    const ai = getAiClient();
    console.log('🔊 Requesting Phrase:', phrase);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: phrase }] }],
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
    if (!base64Audio) throw new Error('API returned no audio data.');

    return base64Audio;
  } catch (error: any) {
    console.error('Phrase Audio Error:', error);
    throw error;
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
