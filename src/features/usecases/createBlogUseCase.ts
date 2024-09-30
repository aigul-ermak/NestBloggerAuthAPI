import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {Blog} from "../blogs/domain/blog.entity";
import {BlogInputDto} from "../blogs/api/models/input/blog-input.dto";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";


export class CreateBlogUseCaseCommand {
    constructor(public createBlogDto: BlogInputDto) {
    }
}

@CommandHandler(CreateBlogUseCaseCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogUseCaseCommand> {
    constructor(private blogsRepository: BlogsRepository) {
    }

    async execute(command: CreateBlogUseCaseCommand) {

        const blog = Blog.create(
            command.createBlogDto.name, command.createBlogDto.description, command.createBlogDto.websiteUrl);

        const createdBlog = await this.blogsRepository.insert(blog);

        return createdBlog.id;
    }
}
