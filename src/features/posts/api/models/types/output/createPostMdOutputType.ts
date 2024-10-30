import {HydratedDocument, ObjectId} from "mongoose";
import {PostDocument} from "../../../../domain/posts.entity";


export type CreatePostMdOutputType = HydratedDocument<PostDocument> & {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    likesCount: number,
    dislikesCount: number
    _id: ObjectId,
    __v: number
}