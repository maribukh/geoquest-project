import { GoogleGenAI, Modality } from '@google/genai';

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  try {
    const { text, type, phrase } = await req.json();

    let prompt = '';
    if (type === 'phrase') {
      prompt = `You are a native Georgian speaker. Pronounce this clearly: "${
        phrase || text
      }"`;
    } else {
      prompt = `Read this tour guide description enthusiastically: "${text}"`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    const audioData =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    return new Response(JSON.stringify({ audio: audioData }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return new Response(JSON.stringify({ error: 'Audio Gen Failed' }), {
      status: 500,
    });
  }
}

