import {Module} from '@nestjs/common';

import {BlogsService} from './application/blogs.service';
import {BlogsRepository} from './infrastructure/blogs.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {Blog, BlogEntity} from './domain/blog.entity';
import {BlogsQueryRepository} from "./infrastructure/blogs.query-repository";
import {IsBlogByIdExistsConstraint} from "../../infrastructure/decorators/validation/blog-is-exist.decorator";
import {CqrsModule} from "@nestjs/cqrs";
import {CreateBlogUseCase} from "./api/usecases/createBlogUseCase";
import {GetBlogByIdUseCase} from "./api/usecases/getBlogByIdUseCase";
import {GetAllBlogsUseCase} from "./api/usecases/getAllBlogsUseCase";
import {DeleteBlogByIdUseCase} from "./api/usecases/deleteBlogByIdUseCase";
import {UpdateBlogUseCase} from "./api/usecases/updateBlogUseCase";
import {CreatePostUseCase} from "../posts/api/usecases/createPostUseCase";
import {PostsModule} from "../posts/posts.module";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {LikesQueryRepository} from "../likePost/infrastructure/likes.query-repository";
import {LikesModule} from "../likePost/likes.module";

const useCases = [CreateBlogUseCase, GetBlogByIdUseCase, GetAllBlogsUseCase,
    DeleteBlogByIdUseCase, UpdateBlogUseCase, CreatePostUseCase,]

@Module({
    imports: [
        MongooseModule.forFeature([{name: Blog.name, schema: BlogEntity}]),
        PostsModule,
        LikesModule,
        CqrsModule,
    ],
    providers: [BlogsService, BlogsRepository, BlogsQueryRepository,
        IsBlogByIdExistsConstraint, PostsQueryRepository, LikesQueryRepository, ...useCases],
    exports: [BlogsRepository, BlogsQueryRepository]
})
export class BlogsModule {
}
