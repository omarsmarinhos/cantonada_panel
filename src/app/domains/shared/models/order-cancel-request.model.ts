export interface OrderCancelRequest {
  iIdPedido: number;
  iIdPedidoFast: number;
  iIdMotivoAnulacion: number;
  tMotivoAnulacion: string;
  iIdUsuario: number;
  lFast: boolean; 
}