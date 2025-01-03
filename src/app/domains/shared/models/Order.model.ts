export interface Order {
  iIdPedido: number;
  iIdCliente: number;
  tNombreCliente?: string;
  tTelefono?: string;
  tEmail: string;
  tTipoDocumento?: string;
  tNroDocumento?: string;
  tTipoEntrega: string;
  iIdSucursal: number;
  tNombreSucursal: string;
  tDireccion?: string;
  tDireccionGoogle?: string;
  tLinkGoogleMaps?: string;
  fFecha: Date;
  tEstado: string;
  tInfoAdicional?: string;
  dSubTotal: number;
  dPrecioDelivery: number;
  dTotal: number;
  tPersonaRecibir?: string;
  lFactura: boolean;
  tRuc?: string;
  tRazonSocial?: string;
  tDireccionFiscal?: string;
  dPedido: OrderDetail[];
  iIdPedidoFast: number;
}

export interface OrderDetail {
  iIdDetallePedido: number;
  iIdProducto: number;
  tNombre: string;
  iCantidad: number;
  dPrecio: number;
  tNota?: string;
  lAdicional: boolean;
  lAdicionalGratis: boolean;
  iIdProductoPertenece?: number;
}
