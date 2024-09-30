import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {CommentsRepository} from "../comments/infrastructure/comments.repository";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";

export class DeleteCommentByIdUseCaseCommand {
    constructor(
        public id: string,
        public userId: string) {
    }
}

@CommandHandler(DeleteCommentByIdUseCaseCommand)
export class DeleteCommentByIdUseCase implements ICommandHandler<DeleteCommentByIdUseCaseCommand> {
    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {
    }

    async execute(command: DeleteCommentByIdUseCaseCommand) {

        const comment = await this.commentsQueryRepository.getCommentById(command.id)

        if (!comment) {
            throw new NotFoundException(`Comment not found`);
        }

        if (comment.commentatorInfo.userId !== command.userId) {
            throw new ForbiddenException('User is not allowed to edit this comment');
        }

        return await this.commentsRepository.deleteComment(command.id);
    }

}