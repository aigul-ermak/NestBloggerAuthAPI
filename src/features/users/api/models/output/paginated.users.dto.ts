import {User} from "../../../domain/users.entity";

export type PaginatedDto<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}