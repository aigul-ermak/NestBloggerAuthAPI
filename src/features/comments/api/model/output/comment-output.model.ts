import {CommentDocument} from "../../../domain/comment.entity";

export class CommentOutputModel {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string
    };
    createdAt: number;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    }
}

export const CommentOutputModelMapper = (newComment: CommentDocument): CommentOutputModel => {
    const outputModel: CommentOutputModel = new CommentOutputModel();

    outputModel.id = newComment._id.toString();
    outputModel.content = newComment.content;
    outputModel.commentatorInfo = {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin
    }
    outputModel.createdAt = +newComment.createdAt;

    outputModel.likesInfo = {
        likesCount: newComment.likesCount,
        dislikesCount: newComment.dislikesCount,
        myStatus: 'None',
    }

    return outputModel;
}

export const CommentLikeOutputModelMapper = (newComment: any, status: string): CommentOutputModel => {
    //TODO type?
    const outputModel = new CommentOutputModel();

    outputModel.id = newComment._id.toString();
    outputModel.content = newComment.content;
    outputModel.commentatorInfo = {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin
    }
    outputModel.createdAt = newComment.createdAt;

    outputModel.likesInfo = {
        likesCount: newComment.likesCount ?? 0,
        dislikesCount: newComment.dislikesCount ?? 0,
        myStatus: status,
    }

    return outputModel;
}