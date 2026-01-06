import { SYSTEM_PROMPT, INITIAL_LANDMARKS } from '../constants';
import {
  QuestResponse,
  Coordinates,
  ChatMessage,
  ItineraryRequest,
  ItineraryItem,
} from '../types';

// --- AUDIO CACHE ---
// Client-side cache to save bandwidth and reduce API calls
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
    throw new Error('Failed to decode audio data.');
  }
}

export function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000
): AudioBuffer {
  if (data.length % 2 !== 0) {
    data = data.slice(0, data.length - 1);
  }

  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  return buffer;
}

// --- NATIVE BROWSER TTS (FALLBACK) ---
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
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// --- SECURE API CALLER ---
// Helper to call our own backend Vercel functions
const callBackend = async (endpoint: string, body: any) => {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header here if you implement Firebase ID Token check on server
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error('QUOTA_EXCEEDED');
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Error (${endpoint}):`, error);
    throw error;
  }
};

// --- FEATURES ---

export const planItinerary = async (
  req: ItineraryRequest
): Promise<ItineraryItem[]> => {
  // We send only necessary data to the server
  const availableLandmarks = INITIAL_LANDMARKS.map((l) => ({
    id: l.id,
    name: l.name,
    category: l.category,
    desc: l.description,
  }));

  const data = await callBackend('plan', {
    request: req,
    availableLandmarks,
  });

  return data.itinerary;
};

export const chatWithLegend = async (
  legendName: string,
  legendBio: string,
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
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

  const data = await callBackend('tts', {
    text: `Gamarjoba! Welcome to ${landmarkName}. ${shortDescription}`,
    type: 'guide',
  });

  if (data.audio) audioCache.set(cacheKey, data.audio);
  return data.audio;
};

export const generatePhraseAudio = async (phrase: string): Promise<string> => {
  const cacheKey = `phrase:${phrase}`;
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey)!;

  const data = await callBackend('tts', {
    text: `Please pronounce: "${phrase}"`,
    phrase: phrase, // Pass phrase specifically for the prompt
    type: 'phrase',
  });

  if (data.audio) audioCache.set(cacheKey, data.audio);
  return data.audio;
};

export const identifyLandmark = async (
  base64Image: string,
  userLocation: Coordinates
): Promise<QuestResponse> => {
  // Strip header if present (data:image/jpeg;base64,) because server needs clean base64 or handling
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const data = await callBackend('identify', {
      image: cleanBase64,
      userLocation,
      systemPrompt: SYSTEM_PROMPT, // We pass the system prompt or keep it on server (better on server for security, but keeping flexibility here)
    });
    return data;
  } catch (error) {
    return {
      location_confirmed: false,
      place_name: 'Connection Error',
      story: 'Could not connect to secure server. Please check internet.',
      points_earned: 0,
      next_quest_hint: 'Try again later.',
    };
  }
};
