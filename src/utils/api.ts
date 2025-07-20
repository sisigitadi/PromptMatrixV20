import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

export const callGeminiApi = async (
  apiKey: string,
  prompt: string,
  model: string = "gemini-pro",
  generationConfig?: GenerationConfig & { responseMimeType?: string },
  imageData?: { data: string; mimeType: string }, // New parameter for image data
) => {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const finalGenerationConfig: GenerationConfig & {
      responseMimeType?: string;
    } = { ...generationConfig };

    const geminiModel = genAI.getGenerativeModel({
      model,
      generationConfig: finalGenerationConfig,
    });

    const parts = [{ text: prompt }];
    if (imageData) {
      parts.push({ inlineData: imageData });
    }

    const result = await geminiModel.generateContent({ contents: [{ parts }] });
    const response = await result.response;
    let fullResponse = "";
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        fullResponse += part.text;
      } else if (part.inlineData) {
        // Assuming image data is base64 encoded and mimeType is available

        fullResponse += `![Image](data:${part.inlineData.mimeType};base64,${part.inlineData.data})`;
      }
    }
    return fullResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return "An unknown error occurred.";
    }
  }
};

export const listGeminiModels = async (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const { models } = await genAI.listModels();
    return models.map((model) => model.name);
  } catch (error: any) {
    console.error("Error listing Gemini models:", error);
    if (error.message) {
      return { error: `Failed to list models: ${error.message}` };
    } else {
      return { error: "An unknown error occurred while listing models." };
    }
  }
};
