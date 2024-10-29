import {PostOutputModel} from "../../../../posts/api/models/output/postDbOutputModel";

export type GetAllPostsForBlogOutputType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostOutputModel[];
}