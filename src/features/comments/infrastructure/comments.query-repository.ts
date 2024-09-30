import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, SortOrder} from "mongoose";
import {Comment, CommentDocument} from "../domain/comment.entity";


@Injectable()
export class CommentsQueryRepository {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
    }

    async getCommentById(commentId: string) {
        return this.commentModel.findOne({_id: commentId});
    }

    async countByPostId(postId: string) {
        return this.commentModel.countDocuments({postId}).exec();
    }

    async findCommentssByPostIdPaginated(
        postId: string,
        sort: string,
        sortDirection: 'asc' | 'desc',
        page: number,
        pageSize: number,
    ) {
        const validPage = Math.max(page, 1);
        const skip = (validPage - 1) * pageSize;
        const sortOption: { [key: string]: SortOrder } = {
            [sort]: sortDirection === 'asc' ? 1 : -1,
        };

        return this.commentModel
            .find({postId})
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize)
            .exec()
    }
}