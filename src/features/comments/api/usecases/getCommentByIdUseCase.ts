import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CommentsQueryRepository} from "../../infrastructure/comments.query-repository";
import {CommentLikeOutputModelMapper,} from "../model/output/comment-output.model";
import {LikesCommentQueryRepository} from "../../../likeComment/infrastructure/likes-comment.query-repository";
import {CommentDocument} from "../../domain/comment.entity";
import {LIKE_STATUS} from "../../../../base/enum/enums";


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

        const comment: CommentDocument | null = await this.commentsQueryRepository.getCommentById(command.id);


        if (!comment) {
            throw new NotFoundException(`Comment not found`);
        }

        let status: LIKE_STATUS = LIKE_STATUS.NONE;

        if (command.userId) {
            const commentLike = await this.likesCommentQueryRepository.getLike(command.id, command.userId);

            status = commentLike ? commentLike.status : LIKE_STATUS.NONE;
        }

        return CommentLikeOutputModelMapper(comment, status);

    }
}