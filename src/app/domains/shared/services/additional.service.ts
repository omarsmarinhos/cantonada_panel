import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../apiUrl';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/Product.model';
import { ProductAdditional } from '../models/ProductAdditional.model';
import { AdditionalResponse } from '../models/AdditionalResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ProductAdditionalService {

  readonly baseUrl = API_URL;
  readonly http = inject(HttpClient);

  constructor() { }

  getAdditional(iIdProducto: number) {
    return this.http.get<AdditionalResponse>(`${this.baseUrl}/ProductoAdicional/Panel/${iIdProducto}`);
  }

  assign(data: any) {
    const formData = new FormData();
    formData.append('iIdProducto', data.iIdProducto.toString());
    formData.append('jAdicionales', JSON.stringify(data.jAdicionales));
    return this.http.post<any>(`${this.baseUrl}/ProductoAdicional/Asignar`, formData);
  }

}
