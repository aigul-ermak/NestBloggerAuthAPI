import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {LikeComment, LikeCommentDocument} from "../domain/like-comment.entity";

@Injectable()
export class LikesCommentRepository {
    constructor(@InjectModel(LikeComment.name) private likeCommentModel: Model<LikeCommentDocument>) {
    }

    async createLike(data: any) {
        const res = await this.likeCommentModel.create(data);
        return res._id.toString();
    }

    async updateLike(id: string, updateData: any) {
        const res = await this.likeCommentModel.updateOne({_id: id}, {
            $set: {
                status: updateData.status,
                userId: updateData.userId,
                commentId: updateData.commentId,
            }
        })
        return !!res.matchedCount;
    }

    async deleteLikeStatus(commentId: string, userId: string) {
        await this.likeCommentModel.deleteMany({commentId, userId});
    }

}