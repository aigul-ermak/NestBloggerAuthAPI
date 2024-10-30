import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {LIKE_STATUS} from "../../../likePost/domain/like.entity";
import {LikeStatusInputDto} from "../../../likePost/api/model/like-status.input.dto";
import {CommentsRepository} from "../../infrastructure/comments.repository";
import {CommentsQueryRepository} from "../../infrastructure/comments.query-repository";
import {LikesCommentRepository} from "../../../likeComment/infrastructure/likes-comment.repository";
import {LikesCommentQueryRepository} from "../../../likeComment/infrastructure/likes-comment.query-repository";
import {CommentDocument} from "../../domain/comment.entity";
import {UserOutputModel} from "../../../users/api/models/output/user.output.model";
import {LikeCommentDocument} from "../../../likeComment/domain/like-comment.entity";


export class CreateLikeForCommentUseCaseCommand {
    constructor(public commentId: string,
                public likeStatus: LikeStatusInputDto,
                public userId: string) {
    }
}

@CommandHandler(CreateLikeForCommentUseCaseCommand)
export class CreateLikeForCommentUseCase implements ICommandHandler<CreateLikeForCommentUseCaseCommand> {

    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
        private likeCommentRepository: LikesCommentRepository,
        private likeCommentQueryRepository: LikesCommentQueryRepository,
    ) {
    }

    async execute(command: CreateLikeForCommentUseCaseCommand) {

        const comment: CommentDocument | null = await this.commentsQueryRepository.getCommentById(command.commentId);

        if (!comment) {
            throw new NotFoundException(`Comment not found`);
        }

        const user: UserOutputModel | null = await this.usersQueryRepository.getUserById(command.userId);

        if (!user) {
            throw new BadRequestException();
        }

        const isLikeExist: boolean = await this.likeCommentQueryRepository.checkLike({
            commentId: command.commentId,
            userId: user.id,
        });

        if (!isLikeExist) {

            const newLike: {
                createdAt: number;
                commentId: string;
                login: string | undefined;
                userId: string;
                status: LIKE_STATUS
            } = {
                status: command.likeStatus.likeStatus,
                userId: command.userId,
                commentId: command.commentId,
                login: user?.login,
                createdAt: Date.now(),
            };

            await this.likeCommentRepository.createLike(newLike);

            if (command.likeStatus.likeStatus == LIKE_STATUS.LIKE) {
                await this.commentsRepository.incrementLikeCount(command.commentId);

            } else if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {
                await this.commentsRepository.incrementDislikeCount(command.commentId,);
            }

        } else {

            const currentLike: LikeCommentDocument | null = await this.likeCommentQueryRepository.getLike(command.commentId, command.userId);

            if (!currentLike) {
                throw new BadRequestException();
            }

            if (command.likeStatus.likeStatus === LIKE_STATUS.NONE) {
                if (currentLike.status === LIKE_STATUS.LIKE) {
                    await this.commentsRepository.decrementLikeCount(command.commentId);
                } else if (currentLike.status === LIKE_STATUS.DISLIKE) {
                    await this.commentsRepository.decrementDislikeCount(command.commentId);
                }
                await this.likeCommentRepository.deleteLikeStatus(command.commentId, command.userId);
                return;
            }

            if (command.likeStatus.likeStatus === LIKE_STATUS.LIKE) {
                if (currentLike!.status === LIKE_STATUS.LIKE) {
                    return;

                } else if (currentLike!.status === LIKE_STATUS.DISLIKE) {
                    await this.commentsRepository.incrementLikeCount(command.commentId);
                    await this.commentsRepository.decrementDislikeCount(command.commentId);
                }
                await this.likeCommentRepository.updateLike(currentLike!._id.toString(), {status: LIKE_STATUS.LIKE});
            }

            if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {

                if (currentLike!.status === LIKE_STATUS.DISLIKE) {
                    return;
                } else if (currentLike!.status === LIKE_STATUS.LIKE) {
                    await this.commentsRepository.decrementLikeCount(command.commentId);
                    await this.commentsRepository.incrementDislikeCount(command.commentId);

                }
                await this.likeCommentRepository.updateLike(currentLike!._id.toString(), {status: LIKE_STATUS.DISLIKE});
            }

        }
    }
}
