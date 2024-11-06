import { Category } from "./Category.model";

export interface Product {
  iIdProducto: number;
  tNombre: string;
  tDescripcion: string;
  dPrecio: number;
  tImagenUrl: string;
  lPrincipal: boolean;
  lDelivery: boolean;
  lRecoger: boolean;
  lConsumir: boolean;
  category?: Category;
}