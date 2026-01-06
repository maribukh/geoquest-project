import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  try {
    const { request, availableLandmarks } = await req.json();

    const prompt = `
        Create a ${request.duration} itinerary for Kutaisi.
        Vibe: ${request.vibe.join(', ')}.
        User Loc: ${request.userLocation.lat}, ${request.userLocation.lng}.
        Priority Landmarks: ${JSON.stringify(
          availableLandmarks.map((l: any) => l.name)
        )}.
    `;

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

    return new Response(
      JSON.stringify({ itinerary: JSON.parse(response.text || '[]') }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Plan Failed' }), {
      status: 500,
    });
  }
}
