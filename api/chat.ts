import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  try {
    const { legendName, legendBio, history, newMessage } = await req.json();

    const systemInstruction = `
        You are acting as ${legendName}. Bio: ${legendBio}.
        Keep responses strictly under 3 sentences. Be warm and archaic.
        Do not reveal you are an AI.
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction },
    });

    // We do not pass full history to 'chats.create' in REST stateless mode effectively without careful management,
    // but for simple turn-based, we construct the prompt context manually or use simple send.
    // For this implementation, we'll do a direct generation with context to ensure stateless reliability on Vercel.

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

    return new Response(JSON.stringify({ reply: response.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Chat Failed' }), {
      status: 500,
    });
  }
}
