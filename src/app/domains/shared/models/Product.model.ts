import { Category } from "./Category.model";

export interface Product {
  iIdProducto: number;
  tNombre: string;
  tDescripcion: string;
  dPrecio: number;
  tImagenUrl: string;
  lDelivery: boolean;
  lRecoger: boolean;
  lPopular: boolean;
  lNovedad: boolean;
  lAdicional: boolean;
  iAdicionalesGratis: number;
  iIdProductoFast: number;
  categoria: Category;
  jSucursales: string;
  tUnidadMedida: string;
}