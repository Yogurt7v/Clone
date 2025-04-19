import { IsEmail, IsOptional, IsString, IsStrongPassword, IsUrl, Length } from "class-validator"


export class CreateUserDto {

    @IsString()
    @Length(2, 50, { message: "Ошибка в длине имени" })
    firstName: string

    @IsString()
    @Length(2, 50, { message: "Ошибка в длине имени" })
    lastName: string

    @IsEmail({}, { message: "Email не подходит" })
    email: string

    @IsString()
    password: string

    @IsString()
    @IsUrl()
    @IsOptional()
    avatarUrl?: string

}