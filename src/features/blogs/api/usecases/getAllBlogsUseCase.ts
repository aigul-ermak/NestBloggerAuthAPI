import {BlogsQueryRepository} from "../../infrastructure/blogs.query-repository";
import {SortBlogsDto} from "../models/input/sort-blog.input.dto";
import {BlogOutputModelMapper} from "../models/output/blogOutputModel";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BlogMdOutputType} from "../models/types/createBlogMdOutputType";
import {GetAllBlogOutputType} from "../models/types/getAllBlogOutputType";


export class GetAllBlogsUseCaseCommand {
    constructor(public sortData: SortBlogsDto) {
    }
}

@CommandHandler(GetAllBlogsUseCaseCommand)
export class GetAllBlogsUseCase implements ICommandHandler<GetAllBlogsUseCaseCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {
    }

    async execute(command: GetAllBlogsUseCaseCommand): Promise<GetAllBlogOutputType> {
        const sortBy: string = command.sortData.sortBy ?? 'createdAt';
        const sortDirection: "asc" | "desc" = command.sortData.sortDirection ?? 'desc';
        const pageNumber: number = command.sortData.pageNumber ?? 1;
        const pageSize: number = command.sortData.pageSize ?? 10;
        const searchNameTerm: string | null = command.sortData.searchNameTerm ?? null;


        let filter: any = {};

        if (searchNameTerm) {
            filter['$or'] = [{
                'name': {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }];
        }

        if (!filter['$or']?.length) {
            filter = {};
        }

        const blogs: BlogMdOutputType[] = (await this.blogsQueryRepository
            .findAllBlogsByFilter(filter, sortBy, sortDirection, (pageNumber - 1) * pageSize, pageSize))
            .map((blog) => blog.toObject() as BlogMdOutputType);
        const totalCount: number = await this.blogsQueryRepository.countDocuments(filter);
        const pageCount: number = Math.ceil(totalCount / pageSize);


        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: blogs.map(BlogOutputModelMapper),
        }

    }
}