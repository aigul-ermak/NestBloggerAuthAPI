import {HydratedDocument} from "mongoose";
import {BlogDocument} from "../../../domain/blog.entity";
import {BlogOutputModel} from "../output/blog.output.model";

export type GetAllBlogOutputType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogOutputModel[];
}