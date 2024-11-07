import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../apiUrl';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/Product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly baseUrl = API_URL;
  readonly http = inject(HttpClient);

  constructor() { }

  getProducts(tCategoria: string) {
    return this.http.get<Product[]>(`${this.baseUrl}/Producto?tCategoria=${tCategoria}`);
  }

  addCategory(product: any) {
    const formData = new FormData();
    formData.append('tNombre', product.tNombre);
    formData.append('tDescripcion', product.tDescripcion);
    formData.append('dPrecio', product.dPrecio.toString());
    formData.append('lDelivery', String(product.lDelivery));
    formData.append('lRecoger', String(product.lRecoger));
    formData.append('lConsumir', String(product.lConsumir));
    formData.append('iIdCategoria', product.iIdCategoria.toString());
    if (product.sucursales && product.sucursales.length > 0) {
      formData.append('jSucursales', JSON.stringify(product.sucursales));
    } else {
      formData.append('jSucursales', '[]');
    }
    formData.append('imagen', product.imagen);
    return this.http.post<any>(`${this.baseUrl}/Producto`, formData);
  }

  deleteProduct(iIdProducto: number) {
    return this.http.delete<any>(`${this.baseUrl}/Producto/${iIdProducto}`);
  }

  orderProducts(ordenProducts: { iId: number; nOrden: number }[]) {
    return this.http.post<any>(`${this.baseUrl}/Producto/Ordenar`, ordenProducts);
  }
}
