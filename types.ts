
export interface Language {
  name: string;
  code: string;
  flag: string;
}

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Question {
  prompt: string; // The English word/phrase to generate an image from
  questionText: string; // The question in English, e.g., "Which one is 'apple'?"
  options: string[]; // Options in the target language
  correctAnswer: string; // Correct answer in the target language
}

export interface LessonPlan {
  topic: string;
  questions: Question[];
}

export interface QuestionWithImage extends Question {
  imageUrl: string;
}

export interface LessonData {
  topic: string;
  questions: QuestionWithImage[];
}
