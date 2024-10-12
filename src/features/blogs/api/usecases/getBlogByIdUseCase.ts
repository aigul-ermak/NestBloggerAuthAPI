import {NotFoundException} from "@nestjs/common";
import {BlogOutputModel, BlogOutputModelMapper} from "../models/output/blog.output.model";
import {BlogsQueryRepository} from "../../infrastructure/blogs.query-repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";


export class GetBlogByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(GetBlogByIdUseCaseCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdUseCaseCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {
    }

    async execute(command: GetBlogByIdUseCaseCommand): Promise<BlogOutputModel | null> {

        const blog = await this.blogsQueryRepository.getBlogById(command.id);


        if (!blog) {
            throw new NotFoundException(`Blog not found`);
        }

        return BlogOutputModelMapper(blog);
    }
}