export class CommentOutputModel {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string
    };
    createdAt: Date;
    likesInfo: {
        likesCount: string;
        dislikesCount: string;
        myStatus: string;
    }
}

export const CommentOutputModelMapper = (newComment: any): CommentOutputModel => {
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