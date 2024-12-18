import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedRequest } from '../models/paginated-request.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Customer } from '../models/Customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getCustomers(request: PaginatedRequest) {
    return this.http.post<PaginatedResponse<Customer[]>>(`${this.baseUrl}/Cliente`, request);
  }

}