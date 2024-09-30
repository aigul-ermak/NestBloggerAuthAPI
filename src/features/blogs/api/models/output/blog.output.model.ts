export class BlogOutputModel {
    id: string;
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean
}

export const BlogOutputModelMapper = (blog: any) => {
    const outputModel = new BlogOutputModel();

    outputModel.id = blog.id;
    outputModel.name = blog.name;
    outputModel.description = blog.description;
    outputModel.websiteUrl = blog.websiteUrl;
    outputModel.createdAt = blog.createdAt;
    outputModel.isMembership = blog.isMembership

    return outputModel;
}