export interface Customer {
  iIdUsuario: number;
  tNombre?: string;
  tApellido?: string;
  tTipoDocumento?: string;
  tNroDocumento?: string;
  tTelefono?: string;
  tEmail: string;
  lGoogle: boolean;
  fFechaRegistro: string;
  fUltimoAcceso?: string;
  tGoogleId?: string;
  tEstado: string;
}