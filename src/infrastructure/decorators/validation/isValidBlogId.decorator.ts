import {applyDecorators} from '@nestjs/common';
import {IsMongoId, Validate} from 'class-validator';
import {IsBlogByIdExistsConstraint} from "./blog-is-exist.decorator";


export function IsValidBlogId() {
    return applyDecorators(
        IsMongoId({message: 'Invalid ID format'}),
        Validate(IsBlogByIdExistsConstraint)
    );
}