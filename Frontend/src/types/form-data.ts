import { Author } from "./author.types";

export type QuestionType = 'text' | 'textarea' | 'multiple-choice' | 'checkbox';

export interface CommentsData {
  id: number
  answer: string | null
  selectedOptions: string[] | null
  createdAt: string
  updatedAt: string
  author: Author
}
export interface QuestionData {
  id: number;
  question: string;
  type: QuestionType;
  options?: string[];
  comments?: CommentsData[]
}

export interface FormData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  author: Author | any;
  title: string;
  questions: QuestionData[];
}

export interface FormResponseData {
  id: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
}

export interface SearchParams {
  createdAt?: "ASC" | "DESC";
  searchTitle?: string | null;
  searchOrder?: "ASC" | "DESC"
  authorId?: number;
}