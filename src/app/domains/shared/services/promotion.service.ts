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

  deletePromotion(iIdPromotion: number) {
    return this.http.delete<any>(`${this.baseUrl}/Promocion/${iIdPromotion}`);
  }


}