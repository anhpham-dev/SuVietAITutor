

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HistoryLessonData, Language } from "../types";

// Helper to get API keys from local storage or fallback to env
const getApiKey = (type: 'gemini' | 'veo'): string | undefined => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(type === 'gemini' ? 'GEMINI_API_KEY' : 'VEO_API_KEY');
    if (stored && stored.trim() !== '') return stored;
  }
  return process.env.API_KEY;
};

// Define the precise schema for the API response
const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the history lesson" },
    summaryPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 concise and accurate main points summarizing the event",
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.STRING },
          event: { type: Type.STRING },
        },
        required: ["year", "event"],
      },
      description: "Chronological timeline of the event",
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        keyCharacters: { type: Type.ARRAY, items: { type: Type.STRING } },
        causes: { type: Type.ARRAY, items: { type: Type.STRING } },
        developments: { type: Type.ARRAY, items: { type: Type.STRING } },
        effects: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["keyCharacters", "causes", "developments", "effects"],
      description: "Character-Cause-Development-Effect analysis chart",
    },
    storyboard: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: { type: Type.INTEGER },
          visualDescription: { type: Type.STRING },
          cameraAngle: { type: Type.STRING },
          action: { type: Type.STRING },
          audio: { type: Type.STRING },
          textOverlay: { type: Type.STRING },
        },
        required: ["sceneNumber", "visualDescription", "cameraAngle", "action", "audio", "textOverlay"],
      },
      description: "5-7 scene video storyboard",
    },
    imagePrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "10 educational motion-graphic image prompts for asset creation",
    },
    voiceOverScript: {
      type: Type.STRING,
      description: "A 45-60 second inspiring and accurate voice-over script",
    },
    quiz: {
      type: Type.OBJECT,
      properties: {
        multipleChoice: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"],
          },
        },
        thinking: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answerGuide: { type: Type.STRING },
            },
            required: ["question", "answerGuide"],
          },
        },
      },
      required: ["multipleChoice", "thinking"],
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING },
          back: { type: Type.STRING },
        },
        required: ["front", "back"],
      },
      description: "10 flashcards for memorization",
    },
  },
  required: [
    "title",
    "summaryPoints",
    "timeline",
    "analysis",
    "storyboard",
    "imagePrompts",
    "voiceOverScript",
    "quiz",
    "flashcards",
  ],
};

export const generateHistoryContent = async (topic: string, language: Language, apiKey?: string): Promise<HistoryLessonData> => {
  const key = apiKey || getApiKey('gemini');

  if (!key) {
    throw new Error("API Key is missing. Ask Admin to set it for your account.");
  }

  const ai = new GoogleGenAI({ apiKey: key });

  const langInstruction = language === 'vi'
    ? "IMPORTANT: ALL CONTENT MUST BE GENERATED IN VIETNAMESE."
    : "IMPORTANT: ALL CONTENT MUST BE GENERATED IN ENGLISH.";

  const systemPrompt = `
    You are an expert AI History Tutor and Content Generator, specializing in Vietnamese history but capable of teaching global history with equal precision.
    Your goal is to create a complete educational package for high school students.
    
    ${langInstruction}
    
    Tone: Accurate, inspiring, clear, and educational.
    Context: If the user inputs a Vietnamese historical event, ensure deep cultural accuracy and respect.
    
    Requirements:
    1. Summary: 5 critical points.
    2. Timeline: Key dates.
    3. Analysis: Deep dive into who, why, how, and result.
    4. Storyboard: Ready for video production (Veo/Runway compatible descriptions).
    5. Prompts: For Midjourney/DALL-E style assets.
    6. Voice-over: ~150-200 words (45-60s).
    7. Quiz: 5 MCQ, 3 Thinking.
    8. Flashcards: 10 pairs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Updated to latest available
      contents: `Generate a history lesson package for the topic: "${topic}". Response must be in ${language === 'vi' ? 'Vietnamese' : 'English'}.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.4,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as HistoryLessonData;
    } else {
      throw new Error("No content generated.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey('gemini');
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const generateVideoFromPrompt = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey('veo');
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("No video URI returned");

  // Fetch the actual video bytes using the key
  const response = await fetch(`${videoUri}&key=${apiKey}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
