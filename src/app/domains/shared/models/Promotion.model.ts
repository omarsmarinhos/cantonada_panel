export interface Promotion {
  iIdPromocion: number;
  tNombre: string;
  tDescripcion?: string;
  lPorFecha: boolean;
  fFechaInicio?: string;
  fFechaFin?: string;
  lPorHora: boolean;
  hHoraInicio?: string;
  hHoraFin?: string;
  lPorImporte: boolean;
  dImporteMin?: number;
  dImporteMax?: number;
  tTipoAplicacion: string;
  tTipoAplicar: string;
  dValorAplicar: number;
  tImagenUrl: string;
  tEnlace?: string;
  jDetalles: string;
}
