import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, you might proxy this through a backend to hide the key, 
// or require the user to input their own key if it's a "BYOK" (Bring Your Own Key) app.
// Following the instructions, we use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBrutalistBio = async (keywords: string): Promise<string> => {
  if (!keywords) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, punchy, "Neo-Brutalist" style bio for a social link profile based on these keywords: "${keywords}".
      
      Style guidelines:
      - Use uppercase text often.
      - Use symbols like //, ::, or [].
      - Keep it under 150 characters.
      - Make it sound edgy, confident, and modern.
      - Do not include hashtags.
      - Return ONLY the bio text.`,
      config: {
        temperature: 0.9,
      }
    });

    return response.text?.trim() || "ERROR_GENERATING_BIO // TRY_AGAIN";
  } catch (error) {
    console.error("Gemini Bio Generation Error:", error);
    return "SYSTEM_OFFLINE // MANUAL_OVERRIDE_REQUIRED";
  }
};