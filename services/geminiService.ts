import { GoogleGenAI, Type } from "@google/genai";
import { Bookmark } from "../types";

// NOTE: in a real extension, you'd likely ask the user to input their key in a settings page,
// or bundle it if you have a proxy server. 
// For this strict environment, we assume process.env.API_KEY is available.

export const categorizeBookmarksWithGemini = async (bookmarks: Bookmark[]): Promise<Record<string, string>> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing");
    return {};
  }

  // Limit to 50 bookmarks at a time to avoid token limits in this demo
  const sample = bookmarks.slice(0, 50).map(b => ({ id: b.id, title: b.title, url: b.url }));

  if (sample.length === 0) return {};

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert bookmark organizer. Analyze the following list of bookmarks and assign a single, short, 1-word or 2-word high-level category to each one (e.g., 'Development', 'News', 'Shopping', 'Social', 'Design'). 
      
      Bookmarks to process:
      ${JSON.stringify(sample)}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categorization: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return {};

    const parsed = JSON.parse(jsonStr);
    const categoryMap: Record<string, string> = {};

    if (parsed.categorization && Array.isArray(parsed.categorization)) {
      parsed.categorization.forEach((item: any) => {
        if (item.id && item.category) {
          categoryMap[item.id] = item.category;
        }
      });
    }

    return categoryMap;

  } catch (error) {
    console.error("Gemini Categorization Failed", error);
    return {};
  }
};