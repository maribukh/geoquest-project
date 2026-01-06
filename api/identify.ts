import { GoogleGenAI, Type } from '@google/genai';

// Initialize on server side - API Key is safe here
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export const config = {
  runtime: 'edge', // Use Edge for lower latency
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
    });
  }

  try {
    const body = await req.json();
    const { image, userLocation } = body;

    if (!image || !userLocation) {
      return new Response(
        JSON.stringify({ error: 'Missing image or location data' }),
        { status: 400 }
      );
    }

    // Server-side prompt construction (More secure, user can't manipulate instructions)
    const prompt = `
      Role: You are "GeoQuest AI", a strict judge of locations in Kutaisi, Georgia.
      User GPS: Lat ${userLocation.lat}, Lng ${userLocation.lng}.
      
      Task: Identify if the image matches a known landmark at these coordinates.
      Output: JSON only.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: image } },
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

    return new Response(response.text, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Server Identify Error:', error);
    return new Response(JSON.stringify({ error: 'AI Processing Failed' }), {
      status: 500,
    });
  }
}
