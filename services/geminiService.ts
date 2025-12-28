import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { QuestResponse, Coordinates } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Audio Helper: Decode Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export const generateAudioGuide = async (landmarkName: string, shortDescription: string): Promise<ArrayBuffer> => {
    try {
        // The TTS model is NOT a chat model. It does not accept system instructions like "Act as a guide".
        // It strictly converts the input text to speech.
        
        const promptText = `Gamarjoba! Welcome to ${landmarkName}. ${shortDescription}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: promptText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data received");

        return base64ToArrayBuffer(base64Audio);

    } catch (error) {
        console.error("Audio Generation Error:", error);
        throw error;
    }
}

export const generatePhraseAudio = async (phrase: string): Promise<ArrayBuffer> => {
    try {
        // Simple TTS for phrases
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: phrase }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data received");

        return base64ToArrayBuffer(base64Audio);
    } catch (error) {
        console.error("Phrase Audio Error:", error);
        throw error;
    }
}

export const identifyLandmark = async (base64Image: string, userLocation: Coordinates): Promise<QuestResponse> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    // Construct a context-aware prompt
    const locationContext = `
      User GPS Location: Latitude ${userLocation.lat}, Longitude ${userLocation.lng}.
      
      INSTRUCTIONS:
      1. Use the GPS location to narrow down the list of possible landmarks in Kutaisi significantly.
      2. Analyze the image visually.
      3. ONLY confirm the location if the visual image MATCHES the landmark expected at these GPS coordinates.
      4. If the image is just a blurry floor, a selfie, or a generic wall, return location_confirmed: false.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: `Identify this location. ${locationContext}`
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            location_confirmed: {
              type: Type.BOOLEAN,
              description: "True ONLY if the visual image matches the landmark located at the provided GPS coordinates.",
            },
            place_name: {
              type: Type.STRING,
              description: "The name of the identified place.",
            },
            story: {
              type: Type.STRING,
              description: "A short, engaging story or legend about the place (max 2 sentences).",
            },
            points_earned: {
              type: Type.INTEGER,
              description: "Points awarded (0 if not confirmed, 50-100 if confirmed).",
            },
            next_quest_hint: {
              type: Type.STRING,
              description: "A cryptic but helpful hint for another nearby location to visit.",
            },
          },
          required: ["location_confirmed", "place_name", "story", "points_earned", "next_quest_hint"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    // SANITIZE JSON: Remove markdown blocks if present (Gemini sometimes adds ```json ... ```)
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText) as QuestResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      location_confirmed: false,
      place_name: "Connection Error",
      story: "The ancient spirits are blocking the signal. Please check your internet and try again.",
      points_earned: 0,
      next_quest_hint: "Try moving to a spot with better reception."
    };
  }
};