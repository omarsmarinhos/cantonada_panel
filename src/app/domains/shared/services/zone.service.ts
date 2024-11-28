import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Zone } from '../models/Zone.model';
import { environment } from '../../../../environments/environment';
import { ZonePolygonResponse } from '../models/ZonePolygonResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  readonly baseUrl = environment.apiUrl;
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

  getPolygons() {
    return this.http.get<ZonePolygonResponse[]>(`${this.baseUrl}/Zona/Polygons`);
  }
}