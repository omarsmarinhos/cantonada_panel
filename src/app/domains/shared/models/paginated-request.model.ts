export interface PaginatedRequest {
    tEstado?: string;
    tCategoria?: string;
    iPageNumber: number;
    iPageSize: number;
    tSort?: string;
    tSearch?: string;
    iIdSucursal?: number;
}