export interface PaginatedRequest {
    tEstado?: string;
    tCategoria?: string;
    iPageNumber: number;
    iPageSize: number;
    tSort?: string;
    tSearch?: string;
    iIdSucursal?: number;
    iIdTipoReclamacion?: number;
    iIdMotivoReserva?: number;
    tTipoEntrega?: string;
}