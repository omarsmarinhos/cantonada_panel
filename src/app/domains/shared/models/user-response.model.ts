export interface UserResponse {
  iIdUsuario: number;
  tNombre: string;
  tUsername: string;
  lAcceso: boolean;
  iIdRol: number;
  tRol: string;
  iIdSucursal?: number;
  tSucursal?: string;
}