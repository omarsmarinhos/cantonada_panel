import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdditionalResponse } from '../models/AdditionalResponse.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductAdditionalService {

  readonly baseUrl = environment.apiUrl;
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
