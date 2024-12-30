export interface Complaint {
  iIdReclamacion: number;
  iIdSucursal: number;
  tSucursal: string;
  tNombre: string;
  tDireccion: string;
  tTipoDocumento: string;
  tNroDocumento: string;
  tTelefono: string;
  tEmail: string;
  tDetalle: string;
  tNroPedido?: string;
  fPedido?: Date;
  tPedidoReclamante: string;
  fFechaRegistro: Date;
  tRespuesta?: string;
  fFechaRespuesta?: Date;
  tEstado: string;
  iIdTipoReclamacion: number;
  tTipoReclamacion: string;
}
