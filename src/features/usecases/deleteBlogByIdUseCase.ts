import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";

export class DeleteBlogByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(DeleteBlogByIdUseCaseCommand)
export class DeleteBlogByIdUseCase implements ICommandHandler<DeleteBlogByIdUseCaseCommand> {
    constructor(
        private blogsRepository: BlogsRepository,
        private blogsQueryRepository: BlogsQueryRepository,
    ) {
    }

    async execute(command: DeleteBlogByIdUseCaseCommand) {

        const blog = await this.blogsQueryRepository.getBlogById(command.id);

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        return await this.blogsRepository.deleteById(command.id);
    }

}