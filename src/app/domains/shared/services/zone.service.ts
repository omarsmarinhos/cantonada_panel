import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../apiUrl';
import { HttpClient } from '@angular/common/http';
import { Zone } from '../models/Zone.model';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  readonly baseUrl = API_URL;
  readonly http = inject(HttpClient);

  constructor() { }

  getZones(iIdSucursal: number) {
    return this.http.get<Zone[]>(`${this.baseUrl}/Zona?iIdSucursal=${iIdSucursal}`);
  }

  addZone(zone: Zone) {
    return this.http.post<any>(`${this.baseUrl}/Zona`, zone);
  }

  editZone(zone: Zone) {
    return this.http.put<any>(`${this.baseUrl}/Zona`, zone);
  }

  deleteZone(iIdZone: number) {
    return this.http.delete<any>(`${this.baseUrl}/Zona/${iIdZone}`);
  }


}