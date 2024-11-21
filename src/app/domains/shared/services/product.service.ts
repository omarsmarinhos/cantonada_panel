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
    formData.append('imagen', product.imagen);

    const productData = {
      tNombre: product.tNombre.trim(),
      tDescripcion: product.tDescripcion.trim(),
      dPrecio: product.dPrecio,
      lDelivery: product.lDelivery,
      lRecoger: product.lRecoger,
      lPopular: product.lPopular,
      lNovedad: product.lNovedad,
      lAdicional: product.lAdicional,
      iIdCategoria: product.iIdCategoria,
      jSucursales: product.sucursales && product.sucursales.length > 0 
        ? JSON.stringify(product.sucursales) 
        : '[]',
    };
    formData.append('productData', JSON.stringify(productData));
    return this.http.post<any>(`${this.baseUrl}/Producto`, formData);
  }

  editProduct(product: any) {
    const formData = new FormData();
    formData.append('imagen', product.imagen);

    const productData = {
      iIdProducto: product.iIdProducto,
      tNombre: product.tNombre.trim(),
      tDescripcion: product.tDescripcion.trim(),
      dPrecio: product.dPrecio,
      lDelivery: product.lDelivery,
      lRecoger: product.lRecoger,
      lPopular: product.lPopular,
      lNovedad: product.lNovedad,
      lAdicional: product.lAdicional,
      iIdCategoria: product.iIdCategoria,
      jSucursales: product.sucursales && product.sucursales.length > 0 
        ? JSON.stringify(product.sucursales) 
        : '[]',
      imageChanged: product.imageChanged
    };

    formData.append('productData', JSON.stringify(productData));
    return this.http.put<any>(`${this.baseUrl}/Producto`, formData);
  }

  deleteProduct(iIdProducto: number) {
    return this.http.delete<any>(`${this.baseUrl}/Producto/${iIdProducto}`);
  }

  orderProducts(ordenProducts: { iId: number; nOrden: number }[]) {
    return this.http.post<any>(`${this.baseUrl}/Producto/Ordenar`, ordenProducts);
  }
}
