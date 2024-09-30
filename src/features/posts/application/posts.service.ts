import {Injectable, NotFoundException} from '@nestjs/common';
import {PostsRepository} from '../infrastructure/posts.repository';
import {InjectModel} from '@nestjs/mongoose';
import {Blog, BlogDocument} from '../../blogs/domain/blog.entity';
import {Model} from 'mongoose';
import {BlogsRepository} from '../../blogs/infrastructure/blogs.repository';
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../infrastructure/posts.query-repository";


@Injectable()
export class PostsService {
    //private postsRepo: any;
    constructor(
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository,
        @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
        private readonly blogsRepository: BlogsRepository,
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {
    }

    // async create(createPostDto: CreatePostInputDto) {
    //     const {title, shortDescription, content, blogId} = createPostDto;
    //
    //     //const blog = await this.blogModel.findById(blogId).exec();
    //     const blog = await this.queryBus.execute(new GetBlogByIdUseCaseCommand(blogId));
    //
    //
    //     if (!blog) {
    //         throw new NotFoundException('Blog not found');
    //     }
    //
    //     const post = Post.create(
    //         title,
    //         shortDescription,
    //         content,
    //         blogId,
    //         blog.name,
    //     );
    //     // const createdPost = await this.postsRepository.insert(post);
    //     const createdPost = await this.commandBus.execute(new CreatePostUseCaseCommand(post));
    //
    //     return {
    //         id: createdPost._id,
    //         title: createdPost.title,
    //         shortDescription: createdPost.shortDescription,
    //         content: createdPost.content,
    //         blogId: createdPost.blogId,
    //         blogName: blog.name,
    //         createdAt: createdPost.createdAt,
    //         extendedLikesInfo: {
    //             likesCount: 0,
    //             dislikesCount: 0,
    //             myStatus: 'None',
    //             newestLikes: [],
    //         },
    //     };
    // }

    // async findAllPaginated(
    //     page: number,
    //     pageSize: number,
    //     sort: string,
    //     direction: 'asc' | 'desc',
    // ): Promise<{ posts: any[]; totalCount: number }> {
    //     const {posts, totalCount} = await this.postsQueryRepository.findAllPaginated(
    //         page,
    //         pageSize,
    //         sort,
    //         direction,
    //     );
    //
    //     const mappedPosts = posts.map((post) => ({
    //         id: post._id,
    //         title: post.title,
    //         shortDescription: post.shortDescription,
    //         content: post.content,
    //         blogId: post.blogId,
    //         blogName: post.blogName,
    //         createdAt: post.createdAt,
    //         extendedLikesInfo: {
    //             likesCount: 0,
    //             dislikesCount: 0,
    //             myStatus: 'None',
    //             newestLikes: [],
    //         },
    //     }));
    //
    //     return {
    //         posts: mappedPosts,
    //         totalCount,
    //     };
    // }

    // async findById(id: string) {
    //     const post = await this.queryBus.execute(new GetPostByIdUseCaseCommand(id));
    // if (!post) {
    //     throw new NotFoundException(`Post with ID ${id} not found`);
    // }
    // return {
    //     id: post._id,
    //     title: post.title,
    //     shortDescription: post.shortDescription,
    //     content: post.content,
    //     blogId: post.blogId,
    //     blogName: post.blogName,
    //     createdAt: post.createdAt,
    //     extendedLikesInfo: {
    //         likesCount: 0,
    //         dislikesCount: 0,
    //         myStatus: 'None',
    //         newestLikes: [],
    //     },
    // };
    // }
    //
    // async deletePostById(id: string): Promise<boolean> {
    //     return await this.postsRepository.deletePostById(id);
    // }
    //
    // async findByBlogId(blogId: string): Promise<PostDocument[]> {
    //     return await this.postsQueryRepository.findByBlogId(blogId);
    // }
    //
    // async countByBlogId(blogId: string): Promise<number> {
    //     return await this.postsQueryRepository.countByBlogId(blogId);
    // }

    // async findByBlogIdPaginated(
    //     blogId: string,
    //     skip: number,
    //     limit: number,
    //     sort: string,
    //     direction: 'asc' | 'desc',
    // ) {
    //     return await this.postsQueryRepository.findByBlogIdPaginated(
    //         blogId,
    //         skip,
    //         limit,
    //         sort,
    //         direction,
    //     );
    // }

    // async update(id: string, updatePostDto: UpdatePostDto) {
    //     const updatedPost = await this.postsRepository.update(id, updatePostDto);
    //     if (!updatedPost) {
    //         throw new NotFoundException(`Post with ID ${id} not found`);
    //     }
    //     return updatedPost;
    // }
}
