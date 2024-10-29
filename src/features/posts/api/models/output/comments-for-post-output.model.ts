import {CommentDocument} from "../../../../comments/domain/comment.entity";

export class CommentsForPostOutputModel {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string
    };
    createdAt: string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    }
}

export const CommentsForPostOutputModelMapper = (postComment: CommentDocument, status: string): CommentsForPostOutputModel => {
    const outputModel: CommentsForPostOutputModel = new CommentsForPostOutputModel();

    outputModel.id = postComment._id.toString();
    outputModel.content = postComment.content;

    outputModel.commentatorInfo = {
        userId: postComment.commentatorInfo.userId,
        userLogin: postComment.commentatorInfo.userLogin
    }
    outputModel.createdAt = postComment.createdAt;

    outputModel.likesInfo = {
        likesCount: postComment.likesCount,
        dislikesCount: postComment.dislikesCount,
        myStatus: status,
    }

    return outputModel;
}