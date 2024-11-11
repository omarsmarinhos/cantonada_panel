import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../apiUrl';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../models/Branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  readonly baseUrl = API_URL;
  readonly http = inject(HttpClient);

  constructor() { }

  getSucursal() {
    return this.http.get<Branch[]>(`${this.baseUrl}/Sucursal`);
  }

  addBranch(sucursalData: any) {
    const formData = new FormData();
    formData.append('tNombre', sucursalData.tNombre);
    formData.append('imagen', sucursalData.imagen);
    formData.append('tDireccion', sucursalData.tDireccion);
    return this.http.post<any>(`${this.baseUrl}/Sucursal`, formData);
  }

  editBranch(sucursalData: any) {
    const formData = new FormData();
    formData.append('iIdSucursal', sucursalData.iIdSucursal);
    formData.append('tNombre', sucursalData.tNombre);
    formData.append('tDireccion', sucursalData.tDireccion);
    formData.append('imageChanged', String(sucursalData.imageChanged));
    if (sucursalData.imageChanged && sucursalData.imagen) {
      formData.append('imagen', sucursalData.imagen);
    }
    return this.http.put<any>(`${this.baseUrl}/Sucursal`, formData);
  }

  deleteBranch(iIdSucursal: number) {
    return this.http.delete<any>(`${this.baseUrl}/Sucursal/${iIdSucursal}`);
  }
}
