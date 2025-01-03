import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/Order.model';
import { OrderBranchResponse } from '../models/order-branch-response.model';
import { PaginatedRequest } from '../models/paginated-request.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { OrderCancelRequest } from '../models/order-cancel-request.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getOrders(request: PaginatedRequest) {
    return this.http.post<PaginatedResponse<Order[]>>(`${this.baseUrl}/Pedido`, request);
  }

  getBranches() {
    return this.http.get<OrderBranchResponse[]>(`${this.baseUrl}/Pedido`);
  }

  cancelOrder(request: OrderCancelRequest) {
    return this.http.post<any>(`${this.baseUrl}/Pedido/Anular`, request)
  }
}
