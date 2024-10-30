import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Blog, BlogDocument} from "../domain/blog.entity";
import {isValidObjectId, Model} from "mongoose";
import {BlogMdOutputType} from "../api/models/types/createBlogMdOutputType";


@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
    }

    async getBlogById(blogId: string): Promise<BlogDocument | null> {

        if (!isValidObjectId(blogId)) {
            return null;
        }
        return await this.blogModel.findById(blogId).exec() as BlogDocument;
    }

    async findAllBlogsByFilter(filter: any, sortBy: string, sortDirection: string, skip: number, limit: number): Promise<BlogMdOutputType[]> {

        const result = await this.blogModel
            .find(filter)
            .sort({[sortBy]: (sortDirection === 'desc' ? -1 : 1)})
            .skip(skip)
            .limit(limit)
            .exec();

        return result as BlogMdOutputType[];
    }

    async countDocuments(filter: any): Promise<number> {
        return this.blogModel.countDocuments(filter).exec();
    }

}