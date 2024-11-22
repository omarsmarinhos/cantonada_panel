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

  deletePromotion(iIdPromocion: number) {
    return this.http.delete<any>(`${this.baseUrl}/Promocion/${iIdPromocion}`);
  }

  search(value: string, tipo: string) {
    return this.http.get<any[]>(`${this.baseUrl}/Promocion/Buscar?value=${value}&tipo=${tipo}`);
  }
}