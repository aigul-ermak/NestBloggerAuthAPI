import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../../infrastructure/posts.query-repository";
import {PostLikeOutputModelMapper, PostOutputModel} from "../models/output/postDbOutputModel";
import {LikesQueryRepository} from "../../../likePost/infrastructure/likes.query-repository";
import {LikeDocument} from "../../../likePost/domain/like.entity";


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

        const post = await this.postsQueryRepository.getPostById(command.id);

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        const newestLikes: {
            createdAt: Date;
            login: string;
            userId: string
        }[] = await this.likesQueryRepository.getNewestLikesForPost(post.id);
        console.error("newestLikes", newestLikes)
        let status = 'None';

        if (command.userId) {
            const likeToPost: LikeDocument | null = await this.likesQueryRepository.getLike(command.id, command.userId);

            status = likeToPost ? likeToPost.status : 'None';
        }

        return PostLikeOutputModelMapper(post, newestLikes, status);

    }
}