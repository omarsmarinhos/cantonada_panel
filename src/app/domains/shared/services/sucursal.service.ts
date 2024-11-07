import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../apiUrl';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/Category.model';
import { Sucursal } from '../models/Sucursal.model';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  readonly baseUrl = API_URL;
  readonly http = inject(HttpClient);

  constructor() { }

  getSucursal() {
    return this.http.get<Sucursal[]>(`${this.baseUrl}/Sucursal`);
  }
}
