import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {CommentInputDto} from "../comments/api/model/input/comment-input.dto";
import {CommentsRepository} from "../comments/infrastructure/comments.repository";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";


export class UpdateCommentUseCaseCommand {
    constructor(
        public id: string,
        public updateCommentDto: CommentInputDto,
        public userId: string) {
    }
}

@CommandHandler(UpdateCommentUseCaseCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentUseCaseCommand> {
    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {
    }

    async execute(command: UpdateCommentUseCaseCommand) {

        const comment = await this.commentsQueryRepository.getCommentById(command.id);

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.commentatorInfo.userId !== command.userId) {
            throw new ForbiddenException('User is not allowed to edit this comment');
        }

        const updatedComment = await this.commentsRepository.updateComment(
            command.id, command.updateCommentDto);

        if (!updatedComment) {
            throw new NotFoundException(`Comment wasn't created`);
        }

        return updatedComment;
    }
}
