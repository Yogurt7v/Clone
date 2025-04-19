import { Author } from "./author.types"

export type QuestionType = 'text' | 'multiple-choice' | 'checkbox' | 'textarea'

export interface SurveyQuestion {
  id: number
  question: string
  type: QuestionType
  options?: string[]
}

export type Question = {
  id: number;
  question: string;
  type: string;
  options?: string[];
  comments: {
    id: number;
    author: Author;
    answer?: string | null;
    selectedOptions?: string[] | null;
    createdAt: string;
    updatedAt: string;
  }[];
}

export type QuestionsData = {
  questions: Question[];
}
