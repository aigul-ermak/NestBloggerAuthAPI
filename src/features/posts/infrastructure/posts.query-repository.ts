import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, SortOrder} from 'mongoose';
import {Post, PostDocument} from '../domain/posts.entity';


@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    }

    async findAll(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    async getPostById(id: string) {
        return this.postModel.findById(id).exec();
    }

    async findAllPostsPaginated(
        sortBy: string,
        sortDirection: string,
        skip: number,
        limit: number
    ) {
        const sortOrder = sortDirection === 'desc' ? -1 : 1;

        const result = await this.postModel
            .find()
            .lean()
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
        return this.postModel.find({blogId}).exec();
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

        return this.postModel
            .find({blogId})
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize)
            .exec()

    }
}
