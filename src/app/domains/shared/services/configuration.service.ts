import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationResponse } from '../models/ConfigurationResponse.model';
import { ConfigImagen } from '../models/ConfigImagen.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getConfiguration() {
    return this.http.get<ConfigurationResponse>(`${this.baseUrl}/Configuracion`);
  }

  getConfigImagen(tTipoImagen: string) {
    return this.http.get<ConfigImagen>(`${this.baseUrl}/Configuracion/Imagen?tTipoImagen=${tTipoImagen}`);
  }

  editConfigGeneral(data: any) {
    return this.http.put<any>(`${this.baseUrl}/Configuracion/General`, data);
  }

  editConfigImagen(data: any) {
    return this.http.put<any>(`${this.baseUrl}/Configuracion/Imagen`, data);
  }
}
