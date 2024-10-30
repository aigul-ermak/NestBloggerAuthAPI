import {PostDocument} from "../../../domain/posts.entity";

export class PostOutputModel {
    id: string
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: {
            addedAt: Date;
            userId: string;
            login: string;
        }[],
    };
}

export const PostLikeOutputModelMapper = (post: PostDocument, newestLikes: any[], status: string): PostOutputModel => {
    const outputModel: PostOutputModel = new PostOutputModel();

    outputModel.id = post._id.toString();
    outputModel.title = post.title;
    outputModel.shortDescription = post.shortDescription;
    outputModel.content = post.content;
    outputModel.blogId = post.blogId;
    outputModel.blogName = post.blogName;
    outputModel.createdAt = post.createdAt;

    outputModel.extendedLikesInfo = {
        likesCount: post.likesCount,
        dislikesCount: post.dislikesCount,
        myStatus: status,
        newestLikes: newestLikes.map(like => ({
            addedAt: like.addedAt,
            userId: like.userId,
            login: like.login
        }))
    }

    return outputModel;
}
