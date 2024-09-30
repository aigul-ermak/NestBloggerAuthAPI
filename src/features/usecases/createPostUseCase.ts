import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../posts/infrastructure/posts.repository";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";
import {CreatePostForBlogInputDto} from "../posts/api/models/input/create-post.input.dto";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {PostsOutputModelMapper} from "../posts/api/models/output/post-db.output.model";
import {LikesQueryRepository} from "../likePost/infrastructure/likes.query-repository";


export class CreatePostUseCaseCommand {

    constructor(public post: CreatePostForBlogInputDto) {
    }
}

@CommandHandler(CreatePostUseCaseCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostUseCaseCommand> {

    constructor(
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository,
        private blogsQueryRepository: BlogsQueryRepository,
        private likesQueryRepository: LikesQueryRepository,
    ) {
    }

    async execute(command: CreatePostUseCaseCommand) {

        const blog = await this.blogsQueryRepository.getBlogById(command.post.blogId);

        if (!blog) {
            throw new NotFoundException(`Blog not found`);
        }

        const newCreatePost = {
            ...command.post,
            blogName: blog.name,
            createdAt: new Date(Date.now()),
        }

        const createdPost = await this.postsRepository.insert(newCreatePost);

        const post = await this.postsQueryRepository.getPostById(createdPost.id);

        if (post === null) {
            throw new NotFoundException(`Post not found`);
        }

        const newestLikes = await this.likesQueryRepository.getNewestLikesForPost(post.id);

        const status = 'None';

        return PostsOutputModelMapper(post, newestLikes, status);
    }
}