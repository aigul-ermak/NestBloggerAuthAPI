import {Trim} from "../../../../../infrastructure/decorators/transform/trim";
import {IsNotEmpty, IsString, Length, Matches} from "class-validator";


export class NewPasswordDto {
    @Trim()
    @IsString()
    @IsNotEmpty()
    @Length(6, 20, {message: "Length not correct"})
    newPassword: string;

    @Trim()
    @IsString()
    @IsNotEmpty()
    recoveryCode: string;
}