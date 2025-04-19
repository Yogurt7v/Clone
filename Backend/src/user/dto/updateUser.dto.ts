import { IsDate, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateUserDto {

    @IsString()
    @Length(2, 50, { message: "Ошибка в длине имени" })
    firstName: string

    @IsString()
    @Length(2, 50, { message: "Ошибка в длине имени" })
    lastName: string

    @IsString()
    @IsUrl()
    @IsOptional()
    avatarUrl?: string | null

}

