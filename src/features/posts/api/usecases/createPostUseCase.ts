import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsRepository} from "../../infrastructure/posts.repository";
import {BlogsQueryRepository} from "../../../blogs/infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";
import {CreatePostForBlogInputDto} from "../models/input/create-post.input.dto";
import {PostsQueryRepository} from "../../infrastructure/posts.query-repository";
import {LikesQueryRepository} from "../../../likePost/infrastructure/likes.query-repository";
import {CreatePostMdOutputType} from "../models/types/output/createPostMdOutputType";
import {PostInputType} from "../models/types/input/createPostInputType";
import {PostLikeOutputModelMapper, PostOutputModel} from "../models/output/postDbOutputModel";
import {PostDocument} from "../../domain/posts.entity";
import {BlogDocument} from "../../../blogs/domain/blog.entity";


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

    async execute(command: CreatePostUseCaseCommand): Promise<PostOutputModel> {

        const blog: BlogDocument | null = await this.blogsQueryRepository.getBlogById(command.post.blogId);

        if (!blog) {
            throw new NotFoundException(`Blog not found`);
        }

        const newCreatePost: PostInputType = {
            ...command.post,
            blogName: blog.name,
            createdAt: new Date(Date.now()),
        }

        const createdPost: CreatePostMdOutputType = await this.postsRepository.insert(newCreatePost);

        const post: PostDocument | null = await this.postsQueryRepository.getPostById(createdPost.id);

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        //TODO
        const newestLikes = await this.likesQueryRepository.getNewestLikesForPost(post.id);
        console.log("newestLikes", newestLikes)
        const status = 'None';

        return PostLikeOutputModelMapper(post, newestLikes, status);
    }
}