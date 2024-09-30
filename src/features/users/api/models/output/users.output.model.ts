import {IsInt, IsOptional, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class GetAllUsersQueryDto {
    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    sortDirection?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageNumber?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize?: number;

    @IsOptional()
    @IsString()
    searchLoginTerm?: string;

    @IsOptional()
    @IsString()
    searchEmailTerm?: string;
}