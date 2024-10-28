import {BlogMdOutputType} from "../types/createBlogMdOutputType";

export class BlogOutputModel {
    id: string;
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean
}

export const BlogOutputModelMapper = (blog: BlogMdOutputType) => {
    const outputModel: BlogOutputModel = new BlogOutputModel();

    outputModel.id = blog._id.toString();
    outputModel.name = blog.name;
    outputModel.description = blog.description;
    outputModel.websiteUrl = blog.websiteUrl;
    outputModel.createdAt = blog.createdAt;
    outputModel.isMembership = blog.isMembership

    return outputModel;
}