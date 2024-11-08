import { Category } from "./Category.model";

export interface Product {
  iIdProducto: number;
  tNombre: string;
  tDescripcion: string;
  dPrecio: number;
  tImagenUrl: string;
  lDelivery: boolean;
  lRecoger: boolean;
  lConsumir: boolean;
  lPopular: boolean;
  lNovedad: boolean;
  categoria: Category;
  jSucursales: string;
}