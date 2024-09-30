export class SortBlogsDto {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: number;
    pageSize?: number;
    searchNameTerm?: string | null;
}
