import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Like, LikeDocument} from "../domain/like.entity";


@Injectable()
export class LikesRepository {
    constructor(
        @InjectModel(Like.name) private likeModel: Model<LikeDocument>) {
    }

    async createLike(data: any): Promise<string> {
        const res = await this.likeModel.create(data);
        return res._id.toString();
    }

    async updateLike(id: string, updateData: any): Promise<boolean> {
        const res = await this.likeModel.updateOne({_id: id}, {
            $set: {
                status: updateData.status,
                userId: updateData.userId,
                parentId: updateData.parentId,
            }
        })
        return !!res.matchedCount;
    }

    async deleteLikeStatus(parentId: string, userId: string): Promise<void> {
        await this.likeModel.deleteMany({parentId, userId});
    }

    async incrementLikeCount(id: string): Promise<void> {
        await this.likeModel.updateOne({_id: id}, {
            $inc: {likesCount: 1}
        });
    }


    async decrementLikeCount(id: string): Promise<void> {
        await this.likeModel.updateOne({_id: id}, {
            $inc: {likesCount: -1}
        });
    }

    async incrementDislikeCount(id: string): Promise<void> {
        await this.likeModel.updateOne({_id: id}, {
            $inc: {dislikesCount: 1}
        });
    }

    async decrementDislikeCount(id: string): Promise<void> {
        await this.likeModel.updateOne({_id: id}, {
            $inc: {dislikesCount: -1}
        });
    }
}
