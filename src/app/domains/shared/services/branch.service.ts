import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../models/Branch.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getSucursal() {
    return this.http.get<Branch[]>(`${this.baseUrl}/Sucursal`);
  }

  getSucursalById(iIdSucursal: number) {
    return this.http.get<Branch>(`${this.baseUrl}/Sucursal/${iIdSucursal}`);
  }

  addBranch(sucursalData: any) {
    const formData = new FormData();
    formData.append('tNombre', sucursalData.tNombre);
    formData.append('imagen', sucursalData.imagen);
    formData.append('tDireccion', sucursalData.tDireccion);
    formData.append('tDireccionGoogle', sucursalData.tDireccionGoogle);
    formData.append('jLatLng', sucursalData.jLatLng);
    formData.append('iIdSucursalFast', sucursalData.iIdSucursalFast);
    formData.append('tRuc', sucursalData.tRuc);
    formData.append('tRazonSocial', sucursalData.tRazonSocial);
    formData.append('tTelefono', sucursalData.tTelefono);
    formData.append('hHoraInicio', sucursalData.hHoraInicio);
    formData.append('hHoraFin', sucursalData.hHoraFin);
    return this.http.post<any>(`${this.baseUrl}/Sucursal`, formData);
  }

  editBranch(sucursalData: any) {
    const formData = new FormData();
    formData.append('iIdSucursal', sucursalData.iIdSucursal);
    formData.append('tNombre', sucursalData.tNombre);
    formData.append('tDireccion', sucursalData.tDireccion);
    formData.append('imageChanged', String(sucursalData.imageChanged));
    formData.append('tDireccionGoogle', sucursalData.tDireccionGoogle);
    formData.append('jLatLng', sucursalData.jLatLng);
    formData.append('iIdSucursalFast', sucursalData.iIdSucursalFast);
    formData.append('tRuc', sucursalData.tRuc);
    formData.append('tRazonSocial', sucursalData.tRazonSocial);
    formData.append('tTelefono', sucursalData.tTelefono);
    formData.append('hHoraInicio', sucursalData.hHoraInicio);
    formData.append('hHoraFin', sucursalData.hHoraFin);
    if (sucursalData.imageChanged && sucursalData.imagen) {
      formData.append('imagen', sucursalData.imagen);
    }
    return this.http.put<any>(`${this.baseUrl}/Sucursal`, formData);
  }

  deleteBranch(iIdSucursal: number) {
    return this.http.delete<any>(`${this.baseUrl}/Sucursal/${iIdSucursal}`);
  }

  toggleStore(branch: Branch) {
    return this.http.put<any>(`${this.baseUrl}/Sucursal/Disponibilidad`, {
      iIdSucursal: branch.iIdSucursal,
      lAbierto: !branch.lAbierto,
      tRuc: branch.tRuc,
      iIdSucursalFast: branch.iIdSucursalFast
    });
  }

  sortBranch(ordenSucursales: { iId: number | undefined; nOrden: number }[]) {
    return this.http.post<any>(`${this.baseUrl}/Sucursal/Ordenar`, ordenSucursales);
  }
}
