import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Like, LIKE_STATUS, LikeDocument} from "../domain/like.entity";


@Injectable()
export class LikesQueryRepository {
    constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {
    }

    async getLike(parentId: string, userId: string): Promise<LikeDocument | null> {
        return this.likeModel.findOne({parentId: parentId, userId: userId});
    }

    async getNewestLikesForPost(postId: string): Promise<LikeDocument[]> {
        const newestLikes = await this.likeModel.find({parentId: postId, status: LIKE_STATUS.LIKE})
            .sort({createdAt: -1})
            .limit(3)
            .lean();

        return newestLikes as LikeDocument[];
    }


    async checkLike({parentId, userId}: { parentId: string, userId: string }): Promise<boolean> {
        const res = await this.likeModel.findOne({parentId: parentId, userId: userId}).lean();
        return !!res;
    }

}