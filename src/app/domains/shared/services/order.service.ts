import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/Order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getOrders() {
    return this.http.get<Order[]>(`${this.baseUrl}/Pedido`);
  }
}
