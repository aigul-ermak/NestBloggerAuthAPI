import {HydratedDocument, ObjectId} from "mongoose";
import {BlogDocument} from "../../../domain/blog.entity";

export type BlogMdOutputType = HydratedDocument<BlogDocument> & {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean
    __v: number
}