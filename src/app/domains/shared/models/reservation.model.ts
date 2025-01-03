export interface Reservation {
  iIdReserva: number;
  iIdSucursal: number;
  tSucursal: string;
  tNombre: string;
  tTelefono: string;
  tEmail: string;
  iIdMotivoReserva: number;
  tMotivoReserva: string;
  iCantidadPersonas: number;
  fReserva: Date;
  hReserva: string;
  tComentarios?: string;
  fRegistro: Date;
  fAprobacion?: Date;
  fRechazo?: Date;
  tRechazo?: string;
  tEstado: string;
}