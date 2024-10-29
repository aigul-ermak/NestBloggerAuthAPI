import {NotFoundException} from "@nestjs/common";
import {BlogOutputModel, BlogOutputModelMapper} from "../models/output/blogOutputModel";
import {BlogsQueryRepository} from "../../infrastructure/blogs.query-repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BlogDocument} from "../../domain/blog.entity";


export class GetBlogByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(GetBlogByIdUseCaseCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdUseCaseCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {
    }

    async execute(command: GetBlogByIdUseCaseCommand): Promise<BlogOutputModel | null> {

        const blog: BlogDocument | null = await this.blogsQueryRepository.getBlogById(command.id);

        if (!blog) {
            throw new NotFoundException(`Blog not found`);
        }

        return BlogOutputModelMapper(blog);
    }
}