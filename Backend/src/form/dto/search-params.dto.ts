import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchParamsDto {
    @IsString()
    @IsOptional()
    createdAt?: "ASC" | "DESC";

    @IsString()
    @IsOptional()
    searchTitle?: string | null;

    @IsString()
    @IsOptional()
    searchOrder?: "ASC" | "DESC"

    @IsNumber()
    @IsOptional()
    authorId?: number;
}