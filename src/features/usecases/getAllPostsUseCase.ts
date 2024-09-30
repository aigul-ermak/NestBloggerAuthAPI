import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {SortPostsDto} from "../posts/api/models/input/sort-post.input.dto";
import {PostsOutputModelMapper} from "../posts/api/models/output/post-db.output.model";
import {LikesQueryRepository} from "../likePost/infrastructure/likes.query-repository";


export class GetAllPostsUseCaseCommand {
    constructor(
        public sortData: SortPostsDto,
        public userId: string,
    ) {
    }
}

@CommandHandler(GetAllPostsUseCaseCommand)
export class GetAllPostsUseCase implements ICommandHandler<GetAllPostsUseCaseCommand> {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private likesQueryRepository: LikesQueryRepository,
    ) {
    }

    async execute(command: GetAllPostsUseCaseCommand) {
        const sortBy = command.sortData.sortBy ?? 'createdAt';
        const sortDirection = command.sortData.sortDirection ?? 'desc';
        const pageNumber = command.sortData.pageNumber ?? 1;
        const pageSize = command.sortData.pageSize ?? 10;

        const posts = await this.postsQueryRepository
            .findAllPostsPaginated(sortBy, sortDirection, (pageNumber - 1) * pageSize, pageSize);


        const totalCount = await this.postsQueryRepository.countDocuments();

        const pageCount = Math.ceil(totalCount / pageSize);

        const mappedPosts = await Promise.all(posts.map(async (post) => {
            const postId = post._id.toString()
            const newestLikes = await this.likesQueryRepository.getNewestLikesForPost(postId);
            const postLike = await this.likesQueryRepository.getLike(postId, command.userId);
            const status = postLike ? postLike.status : 'None';
            return PostsOutputModelMapper(post, newestLikes, status);
        }));

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: mappedPosts,
        }

    }
}