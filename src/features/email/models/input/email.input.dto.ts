import {IsEmail} from "class-validator";

export class ResendEmailDto {
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;
}