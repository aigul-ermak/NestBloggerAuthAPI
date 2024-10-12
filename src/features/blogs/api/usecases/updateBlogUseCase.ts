import {BlogsRepository} from "../../infrastructure/blogs.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UpdateBlogDto} from "../models/input/update-blog.input.dto";
import {BlogsQueryRepository} from "../../infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";


export class UpdateBlogUseCaseCommand {
    constructor(public blogId: string, public updateBlogDto: UpdateBlogDto) {
    }
}

@CommandHandler(UpdateBlogUseCaseCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogUseCaseCommand> {
    constructor(
        private blogsRepository: BlogsRepository,
        private blogsQueryRepository: BlogsQueryRepository,
    ) {
    }

    async execute(command: UpdateBlogUseCaseCommand) {

        const blog = await this.blogsQueryRepository.getBlogById(command.blogId);

        if (!blog) {
            throw new NotFoundException(`Blog not found`);
        }

        const {blogId, updateBlogDto} = command;

        return await this.blogsRepository.update(blogId, updateBlogDto);
    }
}
