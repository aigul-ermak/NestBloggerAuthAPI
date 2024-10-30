import {CommentsForPostOutputModel} from "../../../../posts/api/models/output/comments-for-post-output.model";

export type GetAllCommentsForPostOutputType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentsForPostOutputModel[];
}