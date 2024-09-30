import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";
import {
    CommentLikeOutputModelMapper,
} from "../comments/api/model/output/comment-output.model";
import {LikesCommentQueryRepository} from "../likeComment/infrastructure/likes-comment.query-repository";


export class GetCommentByIdUseCaseCommand {
    constructor(
        public id: string,
        public userId: string | null) {
    }
}

@CommandHandler(GetCommentByIdUseCaseCommand)
export class GetCommentByIdUseCase implements ICommandHandler<GetCommentByIdUseCaseCommand> {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private likesCommentQueryRepository: LikesCommentQueryRepository
    ) {
    }

    async execute(command: GetCommentByIdUseCaseCommand) {

        const comment = await this.commentsQueryRepository.getCommentById(command.id);


        if (!comment) {
            throw new NotFoundException(`Comment not found`);
        }

        let status = 'None';

        if (command.userId) {
            const commentLike = await this.likesCommentQueryRepository.getLike(command.id, command.userId);

            status = commentLike ? commentLike.status : 'None';
        }

        return CommentLikeOutputModelMapper(comment, status);

    }
}