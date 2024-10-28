import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../../../posts/infrastructure/posts.query-repository";
import {SortPostsDto} from "../../../posts/api/models/input/sort-post.input.dto";
import {PostLikeOutputModelMapper, PostOutputModel} from "../../../posts/api/models/output/post-db.output.model";
import {BlogsQueryRepository} from "../../infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";
import {LikesQueryRepository} from "../../../likePost/infrastructure/likes.query-repository";
import {PostDocument} from "../../../posts/domain/posts.entity";
import {BlogMdOutputType} from "../models/types/createBlogMdOutputType";
import {LIKE_STATUS} from "../../../../base/enum/enums";
import {GetAllPostsForBlogOutputType} from "../models/types/getAllPostsForBlogOutputType";


export class GetAllPostsForBlogUseCaseCommand {
    constructor(public blogId: string, public sortData: SortPostsDto, public userId: string | null) {
    }
}

@CommandHandler(GetAllPostsForBlogUseCaseCommand)
export class GetAllPostsForBlogUseCase implements ICommandHandler<GetAllPostsForBlogUseCaseCommand> {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private blogsQueryRepository: BlogsQueryRepository,
        private likesQueryRepository: LikesQueryRepository,
    ) {
    }

    async execute(command: GetAllPostsForBlogUseCaseCommand): Promise<GetAllPostsForBlogOutputType> {
        const sortBy: string = command.sortData.sortBy ?? 'createdAt';
        const sortDirection: "asc" | "desc" = command.sortData.sortDirection ?? 'desc';
        const page: number = command.sortData.pageNumber ?? 1;
        const size: number = command.sortData.pageSize ?? 10;

        const blog: BlogMdOutputType | null = await this.blogsQueryRepository.getBlogById(command.blogId);

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        const totalCount: number = await this.postsQueryRepository.countByBlogId(command.blogId);
        const pagesCount: number = Math.ceil(totalCount / +size);

        const skip = (page - 1) * size;


        const posts: PostDocument[] = await this.postsQueryRepository
            .findPostsByBlogIdPaginated(
                command.blogId,
                sortBy,
                sortDirection,
                (page - 1) * size,
                size
            );


        const mappedPosts: PostOutputModel[] = await Promise.all(posts.map(async (post: PostDocument): Promise<PostOutputModel> => {
            let status: LIKE_STATUS = LIKE_STATUS.NONE;
            console.log("command.userId", command.userId)
            if (command.userId) {
                const postLike = await this.likesQueryRepository.getLike(post.id, command.userId);
                console.log("postLike", postLike)
                //status = postLike ? postLike.status : 'None';
            }
            const newestLikes = await this.likesQueryRepository.getNewestLikesForPost(post.id);
            return PostLikeOutputModelMapper(post, newestLikes, status);
        }));

        return {
            pagesCount: pagesCount,
            page: +page,
            pageSize: +size,
            totalCount: totalCount,
            items: mappedPosts,
        }

    }
}