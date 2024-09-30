import {Trim} from "../../../../../infrastructure/decorators/transform/trim";
import {IsNotEmpty, IsString, Length, Matches} from "class-validator";


export class UserLoginDto {
    @Trim()
    @IsString()
    @IsNotEmpty()
    loginOrEmail: string;

    @Trim()
    @IsString()
    @IsNotEmpty()
    password: string;
}