import {PostDocument} from "../../../domain/posts.entity";

export class PostOutputModel {
    id: string
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: number;
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: {
            createdAt: number;
            userId: string;
            login: string;
        }[],
    };
}

export const PostLikeOutputModelMapper = (post: PostDocument, newestLikes: {
    createdAt: Date;
    login: string;
    userId: string
}[], status: string): PostOutputModel => {
    const outputModel: PostOutputModel = new PostOutputModel();

    outputModel.id = post._id.toString();
    outputModel.title = post.title;
    outputModel.shortDescription = post.shortDescription;
    outputModel.content = post.content;
    outputModel.blogId = post.blogId;
    outputModel.blogName = post.blogName;
    outputModel.createdAt = +post.createdAt;

    outputModel.extendedLikesInfo = {
        likesCount: post.likesCount,
        dislikesCount: post.dislikesCount,
        myStatus: status,
        newestLikes: newestLikes.map(like => ({
            createdAt: +like.createdAt,
            userId: like.userId,
            login: like.login
        }))
    }

    return outputModel;
}
