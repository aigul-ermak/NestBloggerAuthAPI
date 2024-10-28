import {BlogsRepository} from "../../infrastructure/blogs.repository";
import {Blog} from "../../domain/blog.entity";
import {BlogInputDto} from "../models/input/blog-input.dto";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BlogMdOutputType} from "../models/types/createBlogMdOutputType";


export class CreateBlogUseCaseCommand {
    constructor(public createBlogDto: BlogInputDto) {
    }
}

@CommandHandler(CreateBlogUseCaseCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogUseCaseCommand> {
    constructor(private blogsRepository: BlogsRepository) {
    }

    async execute(command: CreateBlogUseCaseCommand): Promise<Blog> {

        const blog: Blog = Blog.create(
            command.createBlogDto.name, command.createBlogDto.description, command.createBlogDto.websiteUrl);

        const createdBlog: BlogMdOutputType = await this.blogsRepository.insert(blog);

        return createdBlog.id;
    }
}
