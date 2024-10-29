import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../../infrastructure/posts.repository";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import {PostsQueryRepository} from "../../infrastructure/posts.query-repository";
import {LikesRepository} from "../../../likePost/infrastructure/likes.repository";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {LikesQueryRepository} from "../../../likePost/infrastructure/likes.query-repository";
import {LIKE_STATUS, LikeDocument} from "../../../likePost/domain/like.entity";
import {LikeStatusInputDto} from "../../../likePost/api/model/like-status.input.dto";
import {PostDocument} from "../../domain/posts.entity";
import {UserOutputModel} from "../../../users/api/models/output/user.output.model";


export class CreateLikeForPostUseCaseCommand {
    constructor(public postId: string,
                public likeStatus: LikeStatusInputDto,
                public userId: string) {
    }
}

@CommandHandler(CreateLikeForPostUseCaseCommand)
export class CreateLikeForPostUseCase implements ICommandHandler<CreateLikeForPostUseCaseCommand> {

    constructor(
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
        private likesRepository: LikesRepository,
        private likeQueryRepository: LikesQueryRepository,
    ) {
    }

    async execute(command: CreateLikeForPostUseCaseCommand) {

        const post: PostDocument = await this.postsQueryRepository.getPostById(command.postId);


        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        const user: UserOutputModel | null = await this.usersQueryRepository.getUserById(command.userId);

        if (!user) {
            throw new BadRequestException();
        }

        const isLikeExist: boolean = await this.likeQueryRepository.checkLike({parentId: post.id, userId: user.id,});

        if (!isLikeExist) {

            const newLike: {
                createdAt: number;
                login: string | undefined;
                userId: string;
                parentId: string;
                status: LIKE_STATUS
            } = {
                status: command.likeStatus.likeStatus,
                userId: command.userId,
                parentId: command.postId,
                login: user?.login,
                createdAt: Date.now(),
            };

            await this.likesRepository.createLike(newLike);

            if (command.likeStatus.likeStatus == LIKE_STATUS.LIKE) {
                await this.postsRepository.incrementLikeCount(command.postId);

            } else if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {
                await this.postsRepository.incrementDislikeCount(command.postId,);
            }

        } else {

            const currentLike: LikeDocument | null = await this.likeQueryRepository.getLike(command.postId, command.userId);
            console.log("currentLike", currentLike)
            if (!currentLike) {
                throw new BadRequestException();
            }
            if (command.likeStatus.likeStatus === LIKE_STATUS.NONE) {
                if (currentLike.status === LIKE_STATUS.LIKE) {
                    await this.likesRepository.decrementLikeCount(command.postId);
                } else if (currentLike.status === LIKE_STATUS.DISLIKE) {
                    await this.likesRepository.decrementDislikeCount(command.postId);
                }
                await this.likesRepository.deleteLikeStatus(command.postId, command.userId);
                return;


                const updatedLikesInfo = {
                    likesCount: 0,
                    dislikesCount: 0,
                };

                await this.postsRepository.updatePostLikesCount(command.postId, updatedLikesInfo)
            }

            if (command.likeStatus.likeStatus === LIKE_STATUS.LIKE) {
                if (currentLike!.status === LIKE_STATUS.LIKE) {
                    return;

                } else if (currentLike!.status === LIKE_STATUS.DISLIKE) {
                    await this.postsRepository.incrementLikeCount(command.postId);
                    await this.postsRepository.decrementDislikeCount(command.postId);

                }
                await this.likesRepository.updateLike(currentLike!._id.toString(), {status: LIKE_STATUS.LIKE});
            }

            if (command.likeStatus.likeStatus === LIKE_STATUS.DISLIKE) {
                if (currentLike!.status === LIKE_STATUS.DISLIKE) {
                    return;
                } else if (currentLike!.status === LIKE_STATUS.LIKE) {

                    await this.postsRepository.decrementLikeCount(command.postId);
                    await this.postsRepository.incrementDislikeCount(command.postId);
                }
                await this.likesRepository.updateLike(currentLike!._id.toString(), {status: LIKE_STATUS.DISLIKE});
            }
        }
    }
}
