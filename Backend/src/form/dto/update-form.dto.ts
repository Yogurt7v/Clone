import { PartialType } from '@nestjs/mapped-types';
import { User } from 'src/entities/user.entity';
import { IsString, Length } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class UpdateFormDto {

    id?: number

    author: User

    @IsString()
    @Length(1, 100, { message: "Ошибка в длине названия" })
    title: string;

    questions: [{

        id?: number

        question: string;

        options: string[]

        type: "text" | "checkbox" | "multiple-choice" | "textarea",
    }]
}
