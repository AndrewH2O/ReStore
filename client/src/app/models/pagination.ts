// match names of whats in the response header
// Pagination:{"currentPage":1,"totalPages":3,"pageSize":6,"totalCount":18}
export interface MetaData {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export class PaginatedResponse<T> {
    items: T;
    metaData: MetaData;
    
    constructor(items: T, metaData:MetaData) {
        this.items = items;
        this.metaData = metaData;
    }
}