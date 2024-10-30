export type CommentInputType = {
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    };
    createdAt: string
    likesCount: number
    dislikesCount: number
}