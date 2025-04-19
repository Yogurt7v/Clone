import { Question } from "./question";

export type allFormsType = {
    message: string,
    AllForms: FormType[],
}

export type FormType = {
    id: number,
    createdAt: string,
    updatedAt?: string,
    title: string,
    questions: Question[];
    author: {
        firstName: string
        lastName: string
        id: number
        avatar: string
    }
}

export type FormTypeById = {
    message: string,
    SingleForm: FormType | null
}

export type AllFormsContentType = {
    message: string,
    AllFormsContent: FormContentType[],
}

export type FormContentType = {
    id: number,
    createdAt?: string,
    updatedAt?: string,
    formId: number,
    question: string | string[],
}

export type FormPostContentType = {
    question: string,
    options: string[] | null,
    type: "text" | "checkbox" | "multiple-choice" | "textarea",
}

export type SingleForm = {
    SingleForm: {
        author: {
            avatarUrl: string
            firstName: string
            lastName: string
        }
        title: string
        questions: {
            id: number
            question: string
            options?: string[]
            comments?: {
                id: number
                answer?: string
                selectedOptions?: number[]
                createdAt: string
            }[]
        }[]
        createdAt: string
    }
}