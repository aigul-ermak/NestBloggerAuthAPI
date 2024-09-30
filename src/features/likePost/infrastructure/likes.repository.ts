import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Like, LikeDocument} from "../domain/like.entity";


@Injectable()
export class LikesRepository {
    constructor(
        @InjectModel(Like.name) private likeModel: Model<LikeDocument>) {
    }

    async createLike(data: any) {
        const res = await this.likeModel.create(data);
        return res._id.toString();
    }

    async updateLike(id: string, updateData: any) {
        const res = await this.likeModel.updateOne({_id: id}, {
            $set: {
                status: updateData.status,
                userId: updateData.userId,
                parentId: updateData.parentId,
            }
        })
        return !!res.matchedCount;
    }

    async deleteLikeStatus(parentId: string, userId: string) {
        await this.likeModel.deleteMany({parentId, userId});
    }
}
