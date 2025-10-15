
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder for environments where the key might not be set.
  // The execution environment is expected to have this variable.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeFlamCard(imageBase64: string): Promise<string> {
  const model = "gemini-2.5-flash";
  
  if (!imageBase64.startsWith('data:image/jpeg;base64,')) {
    throw new Error('Invalid image format. Expected data:image/jpeg;base64.');
  }
  
  const base64Data = imageBase64.split(',')[1];

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data,
    },
  };

  const textPart = {
    text: `You are an expert 'Flam Card' archivist. Analyze this image of a Flam card.
    
    Your task is to identify the card and provide its details in the following format, and only this format:
    
    **CARD_NAME**
    A short, one-sentence, flavorful description of the character or item.
    * ABILITY_1_NAME: A brief description of the ability.
    * ABILITY_2_NAME: A brief description of the ability.
    
    If the image is not a recognized Flam card, respond with:
    **Unknown Artifact**
    This does not appear to be a standard Flam card. It might be a rare variant, a forgery, or something else entirely. The energy signature is unreadable.`
  };
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });

    if (response && response.text) {
        return response.text;
    } else {
        throw new Error("Received an empty response from the AI.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI service failed to process the request.");
  }
}
