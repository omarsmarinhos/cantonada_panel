import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../apiUrl';
import { HttpClient } from '@angular/common/http';
import { ConfigurationResponse } from '../models/ConfigurationResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  readonly baseUrl = API_URL;
  readonly http = inject(HttpClient);

  constructor() { }

  getConfiguration() {
    return this.http.get<ConfigurationResponse>(`${this.baseUrl}/Configuracion`);
  }

  editConfigGeneral(data: any) {
    return this.http.put<any>(`${this.baseUrl}/Configuracion/General`, data);
  }

  editConfigImagen(data: any) {
    return this.http.put<any>(`${this.baseUrl}/Configuracion/Imagen`, data);
  }
}
