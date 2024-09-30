import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Blog, BlogDocument} from '../domain/blog.entity';
import {UpdateBlogDto} from "../api/models/input/update-blog.input.dto";


@Injectable()
export class BlogsRepository {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
    }

    async insert(blog: Blog) {
        const res: BlogDocument[] = await this.blogModel.insertMany(blog);
        return res[0];
    }

    // async findAll(): Promise<Blog[]> {
    //     return this.blogModel.find().exec();
    // }

    // async findById(id: string): Promise<Blog | null> {
    //   return this.blogModel.findById(id).exec();
    // }

    async deleteById(id: string): Promise<boolean> {
        const result = await this.blogModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async findByName(name: string): Promise<Blog | null> {
        return this.blogModel.findOne({name}).exec();
    }

    // async findAllPaginated(
    //     searchTerm: string,
    //     sort: string,
    //     sortDirection: 'asc' | 'desc',
    //     page: number,
    //     pageSize: number,
    // ): Promise<{ blogs: BlogDocument[]; totalCount: number }> {
    //     const skip = (page - 1) * pageSize;
    //     const sortOption: { [key: string]: SortOrder } = {
    //         [sort]: sortDirection === 'asc' ? 1 : -1,
    //     };
    //     const searchFilter = searchTerm
    //         ? {name: new RegExp(searchTerm, 'i')}
    //         : {};
    //
    //     const [blogs, totalCount] = await Promise.all([
    //         this.blogModel
    //             .find(searchFilter)
    //             .sort(sortOption)
    //             .skip(skip)
    //             .limit(pageSize)
    //             .exec(),
    //         this.blogModel.countDocuments(searchFilter),
    //     ]);
    //
    //     return {blogs, totalCount};
    // }

    async update(id: string, updateBlogDto: UpdateBlogDto) {
        return this.blogModel
            .findByIdAndUpdate(id, updateBlogDto, {new: true})
            .exec();
    }
}
