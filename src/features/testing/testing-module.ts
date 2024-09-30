import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {TestingController} from './testing-controller';
import {TestingService} from './testing-service';
import {Blog, BlogEntity} from '../blogs/domain/blog.entity';
import {Post, PostsEntity} from '../posts/domain/posts.entity';
import {User, UsersEntity} from '../users/domain/users.entity';
import {Like, LikesEntity} from "../likePost/domain/like.entity";
import {Comment, CommentsEntity} from "../comments/domain/comment.entity";
import {LikeComment, LikesCommentEntity} from "../likeComment/domain/like-comment.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Blog.name, schema: BlogEntity}]),
        MongooseModule.forFeature([{name: Post.name, schema: PostsEntity}]),
        MongooseModule.forFeature([{name: User.name, schema: UsersEntity}]),
        MongooseModule.forFeature([{name: Like.name, schema: LikesEntity}]),
        MongooseModule.forFeature([{name: Comment.name, schema: CommentsEntity}]),
        MongooseModule.forFeature([{name: LikeComment.name, schema: LikesCommentEntity}]),
    ],
    controllers: [TestingController],
    providers: [TestingService],
})
export class TestingModule {
}
