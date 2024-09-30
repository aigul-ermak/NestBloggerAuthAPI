import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Blog, BlogDocument} from '../blogs/domain/blog.entity';
import {User, UserDocument} from '../users/domain/users.entity';
import {Post, PostDocument} from '../posts/domain/posts.entity';
import {Like, LikeDocument} from "../likePost/domain/like.entity";
import {Comment, CommentDocument} from "../comments/domain/comment.entity";
import {LikeComment, LikeCommentDocument} from "../likeComment/domain/like-comment.entity";

@Injectable()
export class TestingService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        @InjectModel(LikeComment.name) private likeCommentModel: Model<LikeCommentDocument>,
    ) {
    }

    async clearAllData() {
        await this.blogModel.deleteMany({});
        await this.postModel.deleteMany({});
        await this.userModel.deleteMany({});
        await this.likeModel.deleteMany({});
        await this.commentModel.deleteMany({});
        await this.likeCommentModel.deleteMany({});
    }
}
