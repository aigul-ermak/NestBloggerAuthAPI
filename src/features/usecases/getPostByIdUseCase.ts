import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {
    PostOutputModel,
    PostsOutputModelMapper
} from "../posts/api/models/output/post-db.output.model";
import {LikesQueryRepository} from "../likePost/infrastructure/likes.query-repository";


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

        if (post === null) {
            throw new NotFoundException(`Post not found`);
        }
        const newestLikes = await this.likesQueryRepository.getNewestLikesForPost(post.id);

        let status = 'None';

        if (command.userId) {
            const postLike = await this.likesQueryRepository.getLike(command.id, command.userId);
            status = postLike ? postLike.status : 'None';
        }
       

        return PostsOutputModelMapper(post, newestLikes, status);

    }
}