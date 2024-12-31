import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../models/Branch.model';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';
import { ApiFastResponse } from '../models/api-fast-response.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);

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
    formData.append('tRuc', sucursalData.tRuc);
    formData.append('tRazonSocial', sucursalData.tRazonSocial);
    formData.append('tTelefono', sucursalData.tTelefono);
    formData.append('hHoraInicio', sucursalData.hHoraInicio);
    formData.append('hHoraFin', sucursalData.hHoraFin);
    if (this.authService.isSynchronizedWithFast()) {
      formData.append('iIdSucursalFast', sucursalData.iIdSucursalFast);
      formData.append('iIdFormatoOrden', sucursalData.iIdFormatoOrden);
      formData.append('iIdFormatoAnulacion', sucursalData.iIdFormatoAnulacion);
      formData.append('tSerieBoleta', sucursalData.tSerieBoleta);
      formData.append('tSerieFactura', sucursalData.tSerieFactura);
    }

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
    formData.append('tRuc', sucursalData.tRuc);
    formData.append('tRazonSocial', sucursalData.tRazonSocial);
    formData.append('tTelefono', sucursalData.tTelefono);
    formData.append('hHoraInicio', sucursalData.hHoraInicio);
    formData.append('hHoraFin', sucursalData.hHoraFin);
    console.log(this.authService.isSynchronizedWithFast());
    if (this.authService.isSynchronizedWithFast()) {
      formData.append('iIdSucursalFast', sucursalData.iIdSucursalFast);
      formData.append('iIdFormatoOrden', sucursalData.iIdFormatoOrden);
      formData.append('iIdFormatoAnulacion', sucursalData.iIdFormatoAnulacion);
      formData.append('tSerieBoleta', sucursalData.tSerieBoleta);
      formData.append('tSerieFactura', sucursalData.tSerieFactura);
    }
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
      iIdSucursalFast: branch.iIdSucursalFast,
      lFast: this.authService.isSynchronizedWithFast()
    });
  }

  sortBranch(ordenSucursales: { iId: number | undefined; nOrden: number }[]) {
    return this.http.post<any>(`${this.baseUrl}/Sucursal/Ordenar`, ordenSucursales);
  }

  getDataFast(tRuc: string, iIdSucursalFast: number) {
    return this.http.get<any>(`${this.baseUrl}/Sucursal/Fast?tRuc=${tRuc}&iIdSucursalFast=${iIdSucursalFast}`)
      .pipe(
        map((res) => {
          return {
            iIdCajaDiaria: res.iDCajaDiaria,
            iIdFormatoPedido: res.iDFormatoPedido,
            iIdFormatoAnular: res.iDFormatoAnular,
            tSerieBoleta: res.tSerieBoleta,
            tSerieFactura: res.tSerieFactura,
          } as ApiFastResponse
        })
      );
  }
}
