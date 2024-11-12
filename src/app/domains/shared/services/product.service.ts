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

  addProduct(product: any) {
    const formData = new FormData();
    formData.append('tNombre', product.tNombre.toString().trim());
    formData.append('tDescripcion', product.tDescripcion.toString().trim());
    formData.append('dPrecio', product.dPrecio.toString().trim());
    formData.append('lDelivery', String(product.lDelivery));
    formData.append('lRecoger', String(product.lRecoger));
    formData.append('lPopular', String(product.lPopular));
    formData.append('lNovedad', String(product.lNovedad));
    formData.append('iIdCategoria', product.iIdCategoria.toString());
    if (product.sucursales && product.sucursales.length > 0) {
      formData.append('jSucursales', JSON.stringify(product.sucursales));
    } else {
      formData.append('jSucursales', '[]');
    }
    formData.append('imagen', product.imagen);
    return this.http.post<any>(`${this.baseUrl}/Producto`, formData);
  }

  editProduct(product: any) {
    const formData = new FormData();
    formData.append('iIdProducto', product.iIdProducto.toString());
    formData.append('tNombre', product.tNombre.toString().trim());
    formData.append('tDescripcion', product.tDescripcion.toString().trim());
    formData.append('dPrecio', product.dPrecio.toString().trim());
    formData.append('lDelivery', String(product.lDelivery));
    formData.append('lRecoger', String(product.lRecoger));
    formData.append('lPopular', String(product.lPopular));
    formData.append('lNovedad', String(product.lNovedad));
    formData.append('iIdCategoria', product.iIdCategoria.toString());
    if (product.sucursales && product.sucursales.length > 0) {
      formData.append('jSucursales', JSON.stringify(product.sucursales));
    } else {
      formData.append('jSucursales', '[]');
    }
    formData.append('imagen', product.imagen);
    formData.append('imageChanged', String(product.imageChanged));
    return this.http.put<any>(`${this.baseUrl}/Producto`, formData);
  }

  deleteProduct(iIdProducto: number) {
    return this.http.delete<any>(`${this.baseUrl}/Producto/${iIdProducto}`);
  }

  orderProducts(ordenProducts: { iId: number; nOrden: number }[]) {
    return this.http.post<any>(`${this.baseUrl}/Producto/Ordenar`, ordenProducts);
  }
}
