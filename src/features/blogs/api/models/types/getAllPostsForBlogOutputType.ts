import {PostOutputModel} from "../../../../posts/api/models/output/post-db.output.model";

export type GetAllPostsForBlogOutputType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostOutputModel[];
}