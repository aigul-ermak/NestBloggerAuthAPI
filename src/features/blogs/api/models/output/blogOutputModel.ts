import {BlogMdOutputType} from "../types/createBlogMdOutputType";
import {BlogDocument} from "../../../domain/blog.entity";

export class BlogOutputModel {
    id: string;
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean
}

export const BlogOutputModelMapper = (blog: BlogDocument) => {
    const outputModel: BlogOutputModel = new BlogOutputModel();

    outputModel.id = blog._id.toString();
    outputModel.name = blog.name;
    outputModel.description = blog.description;
    outputModel.websiteUrl = blog.websiteUrl;
    outputModel.createdAt = blog.createdAt;
    outputModel.isMembership = blog.isMembership

    return outputModel;
}