import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {LikeComment, LikeCommentDocument} from "../domain/like-comment.entity";
import {Model} from "mongoose";

@Injectable()
export class LikesCommentQueryRepository {
    constructor(@InjectModel(LikeComment.name) private likeCommentModel: Model<LikeCommentDocument>) {
    }

    async getLike(commentId: string, userId: string) {
        return this.likeCommentModel.findOne({commentId: commentId, userId: userId});
    }

    async checkLike({commentId, userId}: { commentId: string, userId: string }) {
        const res = await this.likeCommentModel.findOne({commentId: commentId, userId: userId}).lean();
        return !!res;
    }
}