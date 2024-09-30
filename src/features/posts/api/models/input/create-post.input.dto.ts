import {IsMongoId, IsString, Length, Validate} from "class-validator";
import {Trim} from "../../../../../infrastructure/decorators/transform/trim";
import {IsValidBlogId} from "../../../../../infrastructure/decorators/validation/isValidBlogId.decorator";
import {IsBlogByIdExistsConstraint} from "../../../../../infrastructure/decorators/validation/blog-is-exist.decorator";

export class CreatePostInputDto {
    @IsString()
    @Trim()
    @Length(1, 30, {message: "Length not correct"})
    title: string;

    @IsString()
    @Trim()
    @Length(1, 100, {message: "Length not correct"})
    shortDescription: string;

    @IsString()
    @Trim()
    @Length(1, 1000, {message: "Length not correct"})
    content: string;

    // @IsString()
    // @Trim()
    //@ValidateBlogExists({message: "Blog not correct"})
    @IsMongoId()
    blogId: string;
}

export class CreatePostForBlogInputDto {
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


    //@IsMongoId({message: "Invalid blogId format"})
    @IsString({message: 'It should be a string'})
    // @Validate(IsBlogByIdExistsConstrain
    @IsValidBlogId()
    blogId: string;
}

export class UpdatePostDto {
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

    @IsString()
    @Trim()

    blogId: string;
}
