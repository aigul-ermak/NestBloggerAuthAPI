import {IsString, Length, Matches} from "class-validator";
import {Trim} from "../../../../../infrastructure/decorators/transform/trim";

export class BlogInputDto {
    @IsString()
    @Trim()
    @Length(1, 15, {message: "Length not correct"})
    name: string;

    @IsString()
    @Trim()
    @Length(1, 500, {message: "Description not correct"})
    description: string;

    @Length(1, 100, {message: "WebsiteUrl not correct"})
    @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, {
        message: "Invalid URL format. The URL must start with https://",
    })
    websiteUrl: string;
}

export class CreatePostToBlogDto {
    @IsString()
    @Trim()
    @Length(1, 30, {message: "Length not correct"})
    title: string;

    @IsString()
    @Trim()
    @Length(1, 100, {message: "ShortDescription not correct"})
    shortDescription: string;

    @IsString()
    @Trim()
    @Length(1, 1000, {message: "Content not correct"})
    content: string;
}

