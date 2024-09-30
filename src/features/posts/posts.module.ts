import {Module} from '@nestjs/common';
import {PostsService} from './application/posts.service';
import {MongooseModule} from '@nestjs/mongoose';
import {PostsRepository} from './infrastructure/posts.repository';
import {Post, PostsEntity} from './domain/posts.entity';
import {Blog, BlogEntity} from '../blogs/domain/blog.entity';
import {BlogsRepository} from '../blogs/infrastructure/blogs.repository';
import {PostsQueryRepository} from "./infrastructure/posts.query-repository";
import {CqrsModule} from "@nestjs/cqrs";


@Module({
    imports: [
        MongooseModule.forFeature([{name: Post.name, schema: PostsEntity}]),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogEntity}]),
        CqrsModule,
    ],
    providers: [PostsService, PostsRepository, BlogsRepository, PostsQueryRepository],

    exports: [PostsRepository, PostsQueryRepository],
})
export class PostsModule {
}
