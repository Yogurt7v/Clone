import { IsDateString, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateFormDto {

    @IsNumber()
    author: number

    @IsString()
    @Length(1, 100, { message: "Ошибка в длине названия" })
    title: string;

    questions: [{

        question: string;

        options: string[]

        type: "text" | "checkbox" | "multiple-choice" | "textarea"
    }]
}
