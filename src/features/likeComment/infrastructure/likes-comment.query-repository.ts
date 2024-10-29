import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {LikeComment, LikeCommentDocument} from "../domain/like-comment.entity";
import {Model} from "mongoose";
import {CommentDocument} from "../../comments/domain/comment.entity";

@Injectable()
export class LikesCommentQueryRepository {
    constructor(@InjectModel(LikeComment.name) private likeCommentModel: Model<LikeCommentDocument>) {
    }

    async getLike(commentId: string, userId: string): Promise<LikeCommentDocument | null> {
        return this.likeCommentModel.findOne({commentId, userId}) as unknown as LikeCommentDocument;
    }

    async checkLike({commentId, userId}: { commentId: string, userId: string }): Promise<boolean> {
        const res = await this.likeCommentModel.findOne({commentId, userId}).lean();
        return !!res;
    }
}