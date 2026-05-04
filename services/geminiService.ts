
import { GoogleGenAI, Type } from "@google/genai";
import { Scene, SeoData, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getLanguageName = (lang: Language) => {
  switch (lang) {
    case 'vi': return 'Vietnamese';
    case 'ko': return 'Korean';
    case 'es': return 'Spanish';
    default: return 'English';
  }
};

const getSystemInstruction = (lang: Language) => `You are a world-class Virtual Action Movie Director and Veo 3 Prompt Engineer. 
Your specialty is the "BeamNG.Drive" style (Jota Drive channel) characterized by:
- Soft-body physics (metal crumpling, parts flying off).
- Dark irony and mechanical failures.
- Realistic lighting and chaotic camera movements (POV, Chase, Handheld).
- 8-second scenes.

When generating scenes, ensure the car model, color, and damage state are consistent and progressive. 
The car starts in good (or "falsely premium") condition and ends as a total wreck.

IMPORTANT: You must respond entirely in ${getLanguageName(lang)}, except for the technical parts of the Veo 3 prompt which should remain in English to ensure compatibility with the video generation tool.

Structure each scene as:
SCENE [X]: Prompt: [Subject] + [Action/Physics] + [Environment/Context] + [Camera Style/Lighting] 
Sound/Voice: (Description or short dialogue)`;

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorStr = JSON.stringify(error);
      const isQuotaError = errorStr.includes('429') || error.message?.includes('429');
      
      if (isQuotaError && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Quota exceeded (429). Retry ${i + 1}/${maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateScenesBatch(
  topic: string,
  totalScenes: number,
  batchNumber: number,
  previousScenes: Scene[],
  lang: Language
): Promise<Scene[]> {
  const startIdx = (batchNumber - 1) * 5 + 1;
  const endIdx = Math.min(batchNumber * 5, totalScenes);
  
  const historyContext = previousScenes.length > 0 
    ? `Previous progress: The car is currently ${previousScenes[previousScenes.length - 1].physicsDetail}.`
    : "This is the beginning of the script.";

  const prompt = `Topic: ${topic}
Total Script Length: ${totalScenes} scenes.
Batch: Scenes ${startIdx} to ${endIdx} (8 seconds each).
Context: ${historyContext}

Please generate the next batch of scenes. Adjust the pacing of the story and mechanical failure progression so that it reaches a fitting climax at Scene ${totalScenes}.

Format required for EACH scene in JSON:
{
  "id": number,
  "prompt": "Full Veo 3 prompt string (IN ENGLISH)",
  "soundVoice": "Sound and voice guidance (IN ${getLanguageName(lang).toUpperCase()})",
  "physicsDetail": "Short description of vehicle condition (IN ${getLanguageName(lang).toUpperCase()})"
}`;

  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: getSystemInstruction(lang),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                prompt: { type: Type.STRING },
                soundVoice: { type: Type.STRING },
                physicsDetail: { type: Type.STRING }
              },
              required: ["id", "prompt", "soundVoice", "physicsDetail"]
            }
          }
        }
      });

      const data = JSON.parse(response.text);
      return data as Scene[];
    } catch (error: any) {
      console.error("Gemini batch generation error:", error);
      throw error;
    }
  }).catch(err => {
    const isQuota = JSON.stringify(err).includes('429');
    const localizedQuotaError = () => {
      switch(lang) {
        case 'vi': return "QUOTA_EXHAUSTED: Bạn đã hết lượt sử dụng miễn phí (Rate Limit). Vui lòng đợi 1 phút hoặc nâng cấp API key.";
        case 'ko': return "QUOTA_EXHAUSTED: 사용 할당량을 초과했습니다 (요율 제한). 1분 정도 기다리거나 API 키를 업그레이드하세요.";
        case 'es': return "QUOTA_EXHAUSTED: Ha excedido su cuota actual (Límite de Velocidad). Espere un minuto o actualice su clave API.";
        default: return "QUOTA_EXHAUSTED: You exceeded your current quota (Rate Limit). Please wait a minute or upgrade your API key.";
      }
    };
    const localizedServerError = () => {
      switch(lang) {
        case 'vi': return "Lỗi máy chủ: ";
        case 'ko': return "서버 오류: ";
        case 'es': return "Error del servidor: ";
        default: return "Server error: ";
      }
    };
    throw new Error(isQuota 
      ? localizedQuotaError()
      : localizedServerError() + err.message
    );
  });
}

export async function generateSeoAssets(title: string, scenes: Scene[], lang: Language): Promise<SeoData> {
  const scriptSummary = scenes.map(s => `Scene ${s.id}: ${s.physicsDetail}`).join('\n');
  
  const prompt = `Based on the following BeamNG style action script titled "${title}", generate SEO assets for YouTube/Social Media.
  
Script Summary:
${scriptSummary}

Requirements:
1. Title: Exactly or around 55 characters, clickbaity but relevant.
2. Description: Engaging, high-energy summary.
3. 3 Hashtags: Relevant to gaming/physics/chaos.
4. 5 Keywords: Separated by commas.
5. Thumbnail Prompt: Under 500 characters. Choose the most intense climax scene. Describe it for an image generator (IN ENGLISH).
6. Thumbnail Text Suggestions: Provide 4 short, bold, viral words or phrases (e.g., "THẤT BẠI!", "ĐIÊN RỒ", "TẠI SAO?", "HỎNG HẾT RỒI" for Vietnamese or "FAILED!", "INSANE", "WHY?", "CRASHED" for English) that should appear on the thumbnail.
7. Next Theme Suggestions: Suggest 5 creative, ironic topics for the next video.

All text except the Thumbnail Prompt must be in ${getLanguageName(lang)}.`;

  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              hashtags: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              keywords: { type: Type.STRING },
              thumbnailPrompt: { type: Type.STRING },
              thumbnailTextSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              nextThemeSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "description", "hashtags", "keywords", "thumbnailPrompt", "thumbnailTextSuggestions", "nextThemeSuggestions"]
          }
        }
      });

      const data = JSON.parse(response.text);
      return data as SeoData;
    } catch (error: any) {
      console.error("Gemini SEO asset generation error:", error);
      throw error;
    }
  }).catch(err => {
    const isQuota = JSON.stringify(err).includes('429');
    const localizedQuotaError = () => {
      switch(lang) {
        case 'vi': return "QUOTA_EXHAUSTED: Hết lượt sử dụng SEO. Vui lòng thử lại sau.";
        case 'ko': return "QUOTA_EXHAUSTED: SEO 할당량이 초과되었습니다. 나중에 다시 시도하세요.";
        case 'es': return "QUOTA_EXHAUSTED: Cuota de SEO excedida. Inténtelo más tarde.";
        default: return "QUOTA_EXHAUSTED: SEO quota exceeded. Please try again later.";
      }
    };
    const localizedSeoError = () => {
      switch(lang) {
        case 'vi': return "Lỗi SEO: ";
        case 'ko': return "SEO 오류: ";
        case 'es': return "Error de SEO: ";
        default: return "SEO error: ";
      }
    };
    throw new Error(isQuota 
      ? localizedQuotaError()
      : localizedSeoError() + err.message
    );
  });
}

export async function generateSuggestions(count: number, currentSuggestions: string[], lang: Language): Promise<string[]> {
  const prompt = `Generate ${count} catchy, viral, mechanical-failure-focused BeamNG.Drive style video themes. 
  Themes should be ironic, intense, or chaotic (e.g., "The brake pedal that decided to quit", "Police chase with a loose engine block").
  
  Already suggested: ${currentSuggestions.join(', ')}
  
  Format: JSON array of strings.
  Language: ${getLanguageName(lang)}.`;

  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      return JSON.parse(response.text) as string[];
    } catch (error: any) {
      console.error("Gemini suggestions error:", error);
      throw error;
    }
  });
}

export async function generateImage(model: string, prompt: string, aspectRatio: string): Promise<string> {
  const dynamicAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  return withRetry(async () => {
    try {
      const response = await dynamicAi.models.generateContent({
        model: model,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          }
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      
      throw new Error("No image data found in response.");
    } catch (error: any) {
      console.error("Image generation error:", error);
      throw error;
    }
  });
}
