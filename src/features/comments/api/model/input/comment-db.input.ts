export class NewComment {
    public postId: string;
    public content: string;
    public commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    public createdAt: string;
    public likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    }
}