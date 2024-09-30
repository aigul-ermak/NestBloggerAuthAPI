export class PostCommentOutputModel {
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

export const PostCommentOutputModelMapper = (postComment: any, status: string): PostCommentOutputModel => {
    //TODO type?
    const outputModel = new PostCommentOutputModel();

    outputModel.id = postComment._id.toString();
    outputModel.content = postComment.content;

    outputModel.commentatorInfo = {
        userId: postComment.commentatorInfo.userId,
        userLogin: postComment.commentatorInfo.userLogin
    }
    outputModel.createdAt = postComment.createdAt;

    outputModel.likesInfo = {
        likesCount: postComment.likesCount ?? 0,
        dislikesCount: postComment.dislikesCount ?? 0,
        myStatus: status,
    }

    return outputModel;
}