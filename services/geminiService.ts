import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, ItineraryResult, BoardResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

// Helper to convert File to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to extract JSON from markdown code blocks
const extractJson = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      try { return JSON.parse(match[1]); } catch (e2) {}
    }
    const match2 = text.match(/```\s*([\s\S]*?)\s*```/);
    if (match2) {
      try { return JSON.parse(match2[1]); } catch (e3) {}
    }
    throw new Error("Could not parse JSON response from model");
  }
};

const ITINERARY_JSON_STRUCTURE = `
{
  "title": "Trip Title",
  "destination": "Destination Name",
  "totalEstimatedCost": "$1000 - $1500",
  "days": [
    {
      "day": 1,
      "theme": "Arrival & Exploration",
      "activities": [
        {
          "time": "Morning",
          "activity": "Visit X",
          "description": "Details...",
          "estimatedCost": "$20",
          "location": "Central District"
        }
      ]
    }
  ]
}
`;

const BOARD_JSON_STRUCTURE = `
{
  "title": "Aesthetic Board Title",
  "concept": "Core concept description",
  "scenes": [
    {
      "id": 1,
      "title": "Visual Theme 1",
      "visualDescription": "Detailed visual description of an outfit, location, or item",
      "aestheticNote": "Why this fits the vibe",
      "mood": "Dreamy/Bold/Minimalist"
    }
  ]
}
`;

export const generateItinerary = async (
  input: { imageBase64?: string; mimeType?: string; link?: string },
  prefs: UserPreferences
): Promise<ItineraryResult> => {
  
  const corePrompt = `
    Create a travel itinerary based on this Pinterest inspiration.
    Preferences:
    - Budget: ${prefs.budget}
    - Duration: ${prefs.days} days
    - Travelers: ${prefs.travelers}
    - Vibe: ${prefs.vibe}

    If the input is just a vibe, suggest a real destination that matches perfectly.
    Return ONLY valid JSON.
    Structure: ${ITINERARY_JSON_STRUCTURE}
  `;

  if (input.link) {
    const prompt = `I have a Pinterest link: ${input.link}. Use Google Search to analyze it. ${corePrompt}`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: [{ text: prompt }] },
      config: { tools: [{ googleSearch: {} }] }
    });
    if (!response.text) throw new Error("No response from AI");
    return extractJson(response.text) as ItineraryResult;

  } else if (input.imageBase64 && input.mimeType) {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: input.mimeType, data: input.imageBase64 } },
          { text: corePrompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            destination: { type: Type.STRING },
            totalEstimatedCost: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        activity: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedCost: { type: Type.STRING },
                        location: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text) as ItineraryResult;
  }
  throw new Error("Invalid input");
};

export const generatePinterestBoard = async (
  input: { imageBase64?: string; mimeType?: string; link?: string },
  prefs: UserPreferences
): Promise<BoardResult> => {

  const corePrompt = `
    Analyze this Pinterest inspiration.
    Create a curated "Visual Board" breakdown that explains the aesthetic, key items, locations, and vibe.
    This helps the user recreate this style.
    
    Vibe: ${prefs.vibe}.
    Return ONLY valid JSON.
    Structure: ${BOARD_JSON_STRUCTURE}
  `;

  if (input.link) {
    const prompt = `Link: ${input.link}. Use Google Search to understand the aesthetic. ${corePrompt}`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: [{ text: prompt }] },
      config: { tools: [{ googleSearch: {} }] }
    });
    if (!response.text) throw new Error("No response from AI");
    return extractJson(response.text) as BoardResult;

  } else if (input.imageBase64 && input.mimeType) {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: input.mimeType, data: input.imageBase64 } },
          { text: corePrompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            concept: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  visualDescription: { type: Type.STRING },
                  aestheticNote: { type: Type.STRING },
                  mood: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text) as BoardResult;
  }
  throw new Error("Invalid input");
};