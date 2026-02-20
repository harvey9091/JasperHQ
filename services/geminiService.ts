
import { GoogleGenAI, Type } from "@google/genai";

// Refactored to follow @google/genai initialization and model usage guidelines
export const analyzeConversion = async (urlOrDescription: string) => {
  // Initialize with process.env.API_KEY directly inside the function
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a world-class conversion rate optimization (CRO) expert. 
    Analyze the following website context or URL: "${urlOrDescription}".
    Provide a professional conversion critique in JSON format.
    Include a conversion score (0-100), a short summary critique, and 3 actionable recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex reasoning and expert-level analysis
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            critique: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["score", "critique", "recommendations"]
        }
      }
    });

    // Extract text from response using the .text property (not a method)
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};