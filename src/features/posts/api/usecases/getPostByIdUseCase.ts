import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../../infrastructure/posts.query-repository";
import {PostLikeOutputModelMapper, PostOutputModel} from "../models/output/postDbOutputModel";
import {LikesQueryRepository} from "../../../likePost/infrastructure/likes.query-repository";
import {PostDocument} from "../../domain/posts.entity";
import {LikeDocument} from "../../../likePost/domain/like.entity";
import {LIKE_STATUS} from "../../../../base/enum/enums";


export class GetPostByIdUseCaseCommand {
    constructor(
        public id: string,
        public userId: string | null
    ) {
    }
}

@CommandHandler(GetPostByIdUseCaseCommand)
export class GetPostByIdUseCase implements ICommandHandler<GetPostByIdUseCaseCommand> {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private likesQueryRepository: LikesQueryRepository,
    ) {
    }

    async execute(command: GetPostByIdUseCaseCommand): Promise<PostOutputModel | null> {

        const post: PostDocument | null = await this.postsQueryRepository.getPostById(command.id);

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }
        const newestLikes: LikeDocument[] = await this.likesQueryRepository.getNewestLikesForPost(post.id);

        let status: LIKE_STATUS | string = 'None';

        if (command.userId) {
            const likeToPost: LikeDocument | null = await this.likesQueryRepository.getLike(command.id, command.userId);

            status = likeToPost ? likeToPost.status : 'None';
        }

        return PostLikeOutputModelMapper(post, newestLikes, status);

    }
}