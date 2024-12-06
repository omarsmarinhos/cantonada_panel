export interface PaginatedResponse<T> {
    totalRecords: number,
    totalPages: number,
    data: T
}