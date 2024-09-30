import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions
} from 'class-validator';
import {Injectable} from '@nestjs/common';
import {BlogsQueryRepository} from "../../../features/blogs/infrastructure/blogs.query-repository";


@ValidatorConstraint({name: 'IsBlogByIdExists', async: true})
@Injectable()
export class IsBlogByIdExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {
    }

    async validate(blogId: string, args: ValidationArguments) {

        const blog = await this.blogsQueryRepository.getBlogById(blogId);
        console.log(blog, " blog")
        return !!blog;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Blog with the given ID does not exist';
    }
}

// export function ValidateBlogExists(validationOptions?: ValidationOptions) {
//     return function (object: Object, propertyName: string) {
//         registerDecorator({
//             target: object.constructor,
//             propertyName: propertyName,
//             options: validationOptions,
//             constraints: [],
//             validator: BlogExistsConstraint,
//         });
//     };
// }
