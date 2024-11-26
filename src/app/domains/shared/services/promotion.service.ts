import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../apiUrl';
import { HttpClient } from '@angular/common/http';
import { Promotion } from '../models/Promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  readonly baseUrl = API_URL;
  readonly http = inject(HttpClient);

  constructor() { }

  getPromotions() {
    return this.http.get<Promotion[]>(`${this.baseUrl}/Promocion`);
  }

  addPromotion(dataPromotion: any) {
    const formData = new FormData();
    formData.append('imagen', dataPromotion.imagen);

    const promocionData = {
      tNombre: dataPromotion.tNombre.trim(),
      tDescripcion: dataPromotion.tDescripcion ? dataPromotion.tDescripcion.trim() : null,
      lPorFecha: dataPromotion.lPorFecha,
      fFechaInicio: dataPromotion.fFechaInicio,
      fFechaFin: dataPromotion.fFechaFin,
      lPorHora: dataPromotion.lPorHora,
      hHoraInicio: dataPromotion.hHoraInicio,
      hHoraFin: dataPromotion.hHoraFin,
      lPorImporte: dataPromotion.lPorImporte,
      dImporteMin: dataPromotion.dImporteMin,
      dImporteMax: dataPromotion.dImporteMax,
      tTipoAplicacion: dataPromotion.tTipoAplicacion,
      tTipoAplicar: dataPromotion.tTipoAplicar,
      dValorAplicar: dataPromotion.dValorAplicar,
      tEnlace: dataPromotion.tEnlace ? dataPromotion.tEnlace.trim() : null,
      jDetalleIds: dataPromotion.details && dataPromotion.details.length > 0
        ? JSON.stringify(dataPromotion.details)
        : '[]',
    };

    formData.append('promocionData', JSON.stringify(promocionData));
    return this.http.post<any>(`${this.baseUrl}/Promocion`, formData);
  }

  editPromotion(dataPromotion: any) {
    const formData = new FormData();
    formData.append('imagen', dataPromotion.imagen);

    const promocionData = {
      iIdPromocion: dataPromotion.iIdPromocion,
      tNombre: dataPromotion.tNombre.trim(),
      tDescripcion: dataPromotion.tDescripcion ? dataPromotion.tDescripcion.trim() : null,
      lPorFecha: dataPromotion.lPorFecha,
      fFechaInicio: dataPromotion.fFechaInicio,
      fFechaFin: dataPromotion.fFechaFin,
      lPorHora: dataPromotion.lPorHora,
      hHoraInicio: dataPromotion.hHoraInicio,
      hHoraFin: dataPromotion.hHoraFin,
      lPorImporte: dataPromotion.lPorImporte,
      dImporteMin: dataPromotion.dImporteMin,
      dImporteMax: dataPromotion.dImporteMax,
      tTipoAplicacion: dataPromotion.tTipoAplicacion,
      tTipoAplicar: dataPromotion.tTipoAplicar,
      dValorAplicar: dataPromotion.dValorAplicar,
      tEnlace: dataPromotion.tEnlace ? dataPromotion.tEnlace.trim() : null,
      jDetalleIds: dataPromotion.details && dataPromotion.details.length > 0
        ? JSON.stringify(dataPromotion.details)
        : '[]',
      imageChanged: dataPromotion.imageChanged
    };

    formData.append('promocionData', JSON.stringify(promocionData));
    return this.http.put<any>(`${this.baseUrl}/Promocion`, formData);
  }

  deletePromotion(iIdPromocion: number) {
    return this.http.delete<any>(`${this.baseUrl}/Promocion/${iIdPromocion}`);
  }

  search(value: string, tipo: string) {
    return this.http.get<any[]>(`${this.baseUrl}/Promocion/Buscar?value=${value}&tipo=${tipo}`);
  }
}