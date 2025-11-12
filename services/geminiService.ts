import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, ImageData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createMockup = async (
    logoImage: ImageData,
    productImage: ImageData,
    prompt: string
): Promise<string> => {
    try {
        const finalPrompt = `Take the first image provided, which is a logo, and realistically place it onto the second image, which is a product. Then, apply the following creative instruction: "${prompt || 'Make it look photorealistic'}". Ensure the final image is a high-quality product mockup.`;

        const parts = [
            { inlineData: { data: logoImage.data, mimeType: logoImage.mimeType } },
            { inlineData: { data: productImage.data, mimeType: productImage.mimeType } },
            { text: finalPrompt }
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data found in response.");

    } catch (error) {
        console.error("Error creating mockup:", error);
        throw new Error("Failed to create mockup. Please check the console for details.");
    }
};

export const generateImage = async (
    prompt: string,
    aspectRatio: AspectRatio
): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check the console for details.");
    }
};
