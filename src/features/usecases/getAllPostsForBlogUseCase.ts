import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {SortPostsDto} from "../posts/api/models/input/sort-post.input.dto";
import {PostLikeOutputModelMapper, PostOutputModelMapper} from "../posts/api/models/output/post-db.output.model";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";
import {LikesQueryRepository} from "../likePost/infrastructure/likes.query-repository";


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

    async execute(command: GetAllPostsForBlogUseCaseCommand) {
        const sortBy = command.sortData.sortBy ?? 'createdAt';
        const sortDirection = command.sortData.sortDirection ?? 'desc';
        const page = command.sortData.pageNumber ?? 1;
        const size = command.sortData.pageSize ?? 10;

        const blog = await this.blogsQueryRepository.getBlogById(command.blogId);


        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        const totalCount = await this.postsQueryRepository.countByBlogId(command.blogId);
        const pagesCount = Math.ceil(totalCount / +size);

        const skip = (page - 1) * size;


        const posts = await this.postsQueryRepository
            .findPostsByBlogIdPaginated(
                command.blogId,
                sortBy,
                sortDirection,
                (page - 1) * size,
                size
            );

        //const mappedPosts = posts.map(PostOutputModelMapper);

        let status = 'None';

        const mappedPosts = await Promise.all(posts.map(async (post) => {
            let status = 'None'; // Default status
            if (command.userId) {
                const postLike = await this.likesQueryRepository.getLike(post.id, command.userId); // Change command.id to post.id
                status = postLike ? postLike.status : 'None';
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