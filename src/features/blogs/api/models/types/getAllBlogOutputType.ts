import {BlogOutputModel} from "../output/blogOutputModel";

export type GetAllBlogOutputType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogOutputModel[];
}