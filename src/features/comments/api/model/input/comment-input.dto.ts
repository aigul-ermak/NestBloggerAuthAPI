import {IsString, Length} from "class-validator";
import {Trim} from "../../../../../infrastructure/decorators/transform/trim";

export class CommentInputDto {
    @IsString()
    @Trim()
    @Length(20, 300, {message: "Length not correct"})
    content: string;
}


