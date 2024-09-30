export class SortPostsDto {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: number;
    pageSize?: number;
}
