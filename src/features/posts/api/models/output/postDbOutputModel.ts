import {PostType} from "../input/post-db.input.model";
import {PostDocument} from "../../../domain/posts.entity";

export class PostOutputModel {
    id: string
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: {
            addedAt: string;
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
    outputModel.createdAt = post.createdAt.toString();

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

export const PostsOutputModelMapper = (post: PostType, newestLikes: any[], status: string): PostOutputModel => {
    const outputModel = new PostOutputModel();

    outputModel.id = post.id.toString();
    outputModel.title = post.title;
    outputModel.shortDescription = post.shortDescription;
    outputModel.content = post.content;
    outputModel.blogId = post.blogId;
    outputModel.blogName = post.blogName;
    outputModel.createdAt = post.createdAt.toString();

    outputModel.extendedLikesInfo = {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: status,
        newestLikes: newestLikes.map(like => ({
            addedAt: like.addedAt,
            userId: like.userId,
            login: like.login
        }))
    }

    return outputModel;
}