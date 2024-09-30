import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Post, PostDocument} from '../domain/posts.entity';
import {UpdatePostDto} from '../api/models/input/create-post.input.dto';
import {UpdatePostLikesCountDto} from "../api/models/input/create-postLikesCount.input.dto";

@Injectable()
export class PostsRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    }

    async insert(post: any) {
        const res = await this.postModel.insertMany(post);
        return res[0];
    }

    async deletePostById(id: string): Promise<boolean> {
        const result = await this.postModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async update(id: string, updatePostDto: UpdatePostDto) {
        return this.postModel
            .findByIdAndUpdate(id, updatePostDto, {new: true})
            .exec();
    }

    async updatePostLikesCount(id: string, updatePostLikesCountDto: UpdatePostLikesCountDto) {
        return this.postModel
            .findByIdAndUpdate(id, updatePostLikesCountDto, {new: true})
            .exec();
    }

    async incrementLikeCount(id: string) {
        await this.postModel.updateOne({_id: id}, {
            $inc: {likesCount: 1}
        });
    }


    async decrementLikeCount(id: string) {
        await this.postModel.updateOne({_id: id}, {
            $inc: {likesCount: -1}
        });
    }

    async incrementDislikeCount(id: string) {
        await this.postModel.updateOne({_id: id}, {
            $inc: {dislikesCount: 1}
        });
    }

    async decrementDislikeCount(id: string) {
        await this.postModel.updateOne({_id: id}, {
            $inc: {dislikesCount: -1}
        });
    }
}
