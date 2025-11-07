
import { GoogleGenAI, Type } from '@google/genai';
import { LessonPlan, Level } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const lessonSchema = {
  type: Type.OBJECT,
  properties: {
    topic: {
      type: Type.STRING,
      description: "A concise topic for the lesson, like 'Common Fruits' or 'Basic Greetings'."
    },
    questions: {
      type: Type.ARRAY,
      description: "An array of 5 multiple-choice questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          prompt: {
            type: Type.STRING,
            description: "The single English word or short phrase for the image generation. E.g., 'apple', 'hello'."
          },
          questionText: {
            type: Type.STRING,
            description: "The question for the user in English, e.g., 'Which one is `apple`?'"
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 strings, with one correct answer and three plausible distractors in the target language.",
            items: { type: Type.STRING }
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct translation from the options list."
          }
        },
        required: ["prompt", "questionText", "options", "correctAnswer"]
      }
    }
  },
  required: ["topic", "questions"]
};

const getLevelDescription = (level: Level): string => {
    switch (level) {
        case 'Beginner':
            return 'The lesson should focus on basic vocabulary (e.g., common objects, simple greetings). Use simple sentence structures.';
        case 'Intermediate':
            return 'The lesson should involve more complex sentences, verb conjugations, and basic grammar concepts. Introduce common phrases.';
        case 'Advanced':
            return 'The lesson should focus on idiomatic expressions, nuanced grammar, advanced vocabulary, and more complex sentence structures.';
        default:
            return 'The lesson should be at a beginner level.';
    }
}

export const generateLesson = async (language: string, level: Level): Promise<LessonPlan> => {
  const model = 'gemini-2.5-pro';
  const levelDescription = getLevelDescription(level);
  const prompt = `Create a ${level}-level language lesson for an English speaker learning ${language}. ${levelDescription} Generate a JSON object with a topic and 5 multiple-choice questions. Each question must have a 'prompt' (a single English word for an image), 'questionText' (the question in English), 'options' (4 choices in ${language}), and the 'correctAnswer'. Ensure one of the options is the correct answer. The distractors should be plausible but incorrect.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: lessonSchema,
      },
    });

    const text = response.text.trim();
    // Gemini with JSON schema might still wrap the output in ```json ... ```
    const cleanJsonText = text.replace(/^```json\s*/, '').replace(/```$/, '');
    const lesson = JSON.parse(cleanJsonText);
    
    if (!lesson.questions || lesson.questions.length === 0) {
      throw new Error("AI returned an empty lesson plan.");
    }

    return lesson as LessonPlan;
  } catch (error) {
    console.error(`Error generating ${level} lesson for ${language}:`, error);
    throw new Error(`Failed to generate lesson content. The AI may have returned an invalid format. Please try again.`);
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const model = 'imagen-4.0-generate-001';
  const fullPrompt = `A simple, clear, friendly cartoon-style illustration of "${prompt}". Vector art style, on a plain white background, Duolingo style.`;

  try {
    const response = await ai.models.generateImages({
      model: model,
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/png',
      },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error('No image was generated.');
  } catch (error) {
    console.error(`Error generating image for prompt "${prompt}":`, error);
    throw new Error('Failed to generate lesson image.');
  }
};

export const getHint = async (question: string, options: string[], language: string): Promise<string> => {
    const model = 'gemini-2.5-flash-lite';
    const prompt = `I am learning ${language}. The question is "${question}". The options are: ${options.join(', ')}. Provide a very short and simple hint in English to help me choose the correct answer without giving the answer away directly.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('Error getting hint:', error);
        return "Sorry, I couldn't get a hint right now.";
    }
};
