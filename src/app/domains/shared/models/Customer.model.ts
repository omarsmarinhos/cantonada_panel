export interface Customer {
  iIdUsuario: number;
  tNombre?: string;
  tApellido?: string;
  tTipoDocumento?: string;
  tNroDocumento?: string;
  tTelefono?: string;
  tEmail: string;
  lGoogle: boolean;
  lEmail: boolean;
  fFechaRegistro: string;
  fUltimoAcceso?: string;
  tUidFirebase?: string;
  tEstado: string;
}