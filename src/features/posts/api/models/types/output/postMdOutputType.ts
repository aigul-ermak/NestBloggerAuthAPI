import {HydratedDocument, ObjectId} from "mongoose";
import {PostDocument} from "../../../../domain/posts.entity";


export type PostMdOutputType = HydratedDocument<PostDocument> & {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    likesCount: number
    dislikesCount: number
    __v: number

}