import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, SortOrder} from 'mongoose';
import {Post, PostDocument} from '../domain/posts.entity';
import {PostMdOutputType} from "../api/models/types/output/postMdOutputType";


@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    }

    async findAll(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    async getPostById(id: string): Promise<PostMdOutputType> {
        const result = await this.postModel.findById(id).exec();
        return result as unknown as PostMdOutputType;
    }

    async findAllPostsPaginated(
        sortBy: string,
        sortDirection: string,
        skip: number,
        limit: number
    ): Promise<PostDocument[]> {
        const sortOrder = sortDirection === 'desc' ? -1 : 1;

        const result = await this.postModel
            .find()
            .sort({[sortBy]: sortOrder})
            .skip(skip)
            .limit(limit)
            .exec();

        return result;
    }

    async countDocuments(): Promise<number> {
        return this.postModel.countDocuments().exec();
    }

    async findByBlogId(blogId: string): Promise<PostDocument[]> {
        return this.postModel.find({blogId});
    }

    async countByBlogId(blogId: string) {
        return this.postModel.countDocuments({blogId}).exec();
    }

    async findPostsByBlogIdPaginated(
        blogId: string,
        sort: string,
        sortDirection: 'asc' | 'desc',
        page: number,
        pageSize: number,
    ): Promise<PostDocument[]> {
        const validPage = Math.max(page, 1); // Ensure page is at least 1
        const skip = (validPage - 1) * pageSize;
        const sortOption: { [key: string]: SortOrder } = {
            [sort]: sortDirection === 'asc' ? 1 : -1,
        };

        const res: PostDocument[] = await this.postModel
            .find({blogId})
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize)
            .exec()

        return res as PostDocument[];
    }
}
