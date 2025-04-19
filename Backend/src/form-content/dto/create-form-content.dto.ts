import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateFormContentDto {

    @IsNumber()
    id: number;

    @IsString()
    question: string;

    @IsArray()
    options: string[]

    @IsString()
    type: string
}
