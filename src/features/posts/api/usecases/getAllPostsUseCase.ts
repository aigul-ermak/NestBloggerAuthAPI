import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../../infrastructure/posts.query-repository";
import {SortPostsDto} from "../models/input/sort-post.input.dto";
import {PostLikeOutputModelMapper, PostOutputModel} from "../models/output/postDbOutputModel";
import {LikesQueryRepository} from "../../../likePost/infrastructure/likes.query-repository";
import {PostDocument} from "../../domain/posts.entity";
import {GetAllPostsForBlogOutputType} from "../../../blogs/api/models/types/getAllPostsForBlogOutputType";


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

    async execute(command: GetAllPostsUseCaseCommand): Promise<GetAllPostsForBlogOutputType> {
        const sortBy = command.sortData.sortBy ?? 'createdAt';
        const sortDirection = command.sortData.sortDirection ?? 'desc';
        const pageNumber = command.sortData.pageNumber ?? 1;
        const pageSize = command.sortData.pageSize ?? 10;

        const posts: PostDocument[] = await this.postsQueryRepository
            .findAllPostsPaginated(sortBy, sortDirection, (pageNumber - 1) * pageSize, pageSize);

        const totalCount: number = await this.postsQueryRepository.countDocuments();

        const pageCount: number = Math.ceil(totalCount / pageSize);

        const mappedPosts = await Promise.all(posts.map(async (post: PostDocument): Promise<PostOutputModel> => {
            const postId: string = post._id.toString()
            const newestLikes = await this.likesQueryRepository.getNewestLikesForPost(postId);
            console.log("newestLikes", newestLikes)
            const postLike = await this.likesQueryRepository.getLike(postId, command.userId);
            console.log("postLike", postLike)
            //const status: LIKE_STATUS = postLike ? postLike.status : LIKE_STATUS.NONE;
            const status = 'None';
            return PostLikeOutputModelMapper(post, newestLikes, status);
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