import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../../infrastructure/posts.repository";
import {PostsQueryRepository} from "../../infrastructure/posts.query-repository";
import {NotFoundException} from "@nestjs/common";
import {PostDocument} from "../../domain/posts.entity";

export class DeletePostByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(DeletePostByIdUseCaseCommand)
export class DeletePostByIdUseCase implements ICommandHandler<DeletePostByIdUseCaseCommand> {
    constructor(
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository
    ) {
    }

    async execute(command: DeletePostByIdUseCaseCommand): Promise<boolean> {

        const post: PostDocument | null = await this.postsQueryRepository.getPostById(command.id)

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        return await this.postsRepository.deletePostById(command.id);
    }

}