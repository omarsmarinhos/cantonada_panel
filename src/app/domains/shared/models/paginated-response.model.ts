export interface PaginatedResponse<T> {
    totalRecords: number;
    totalPages: number;
    tSucursal: string;
    data: T;
}