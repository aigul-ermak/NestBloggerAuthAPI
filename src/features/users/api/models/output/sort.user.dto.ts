export class SortUserDto {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: number;
    pageSize?: number;
    searchLoginTerm?: string;
    searchEmailTerm?: string;
}
