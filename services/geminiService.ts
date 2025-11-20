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
        throw new Error("응답에서 이미지 데이터를 찾을 수 없습니다.");

    } catch (error) {
        console.error("Error creating mockup:", error);
        throw new Error("목업 생성에 실패했습니다. 자세한 내용은 콘솔을 확인해주세요.");
    }
};

export const generateImage = async (
    prompt: string,
    aspectRatio: AspectRatio
): Promise<string> => {
    try {
        const enhancedPrompt = `${prompt} (가로세로 비율: ${aspectRatio})`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { 
                parts: [{ text: enhancedPrompt }] 
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("응답에서 이미지 데이터를 찾을 수 없습니다.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("이미지 생성에 실패했습니다. 자세한 내용은 콘솔을 확인해주세요.");
    }
};
