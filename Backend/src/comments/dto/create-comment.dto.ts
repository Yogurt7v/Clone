import { IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/entities/user.entity";

export class CreateCommentDto {

    @IsNumber()
    questionId: number

    @IsNumber()
    userId: User['id']

    data: {
        answer: string | null;
        selectedOptions?: string[] | number[];
    }

}
