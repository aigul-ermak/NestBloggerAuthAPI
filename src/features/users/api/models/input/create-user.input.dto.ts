import {Trim} from "../../../../../infrastructure/decorators/transform/trim";
import {IsString, Length, Matches} from "class-validator";
import {IsOptionalEmail} from "../../../../../infrastructure/decorators/validation/is-optional-email";


export class CreateUserDto {
    @IsString()
    @Trim()
    @Length(3, 10, {message: "Length not correct"})
    @Matches(/^[a-zA-Z0-9_-]*$/, {
        message: 'Login can only contain letters, numbers, underscores, and hyphens.',
    })
    login: string

    @Length(6, 20, {message: "Length not correct"})
    password: string

    @IsOptionalEmail()
    email: string
}