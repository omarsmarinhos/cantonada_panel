import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedRequest } from '../models/paginated-request.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { UserResponse } from '../models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getUsers(request: PaginatedRequest) {
    return this.http.post<PaginatedResponse<UserResponse[]>>(`${this.baseUrl}/Usuario`, request);
  }

  delete(iIdSucursal: number) {
    return this.http.delete<any>(`${this.baseUrl}/Usuario/${iIdSucursal}`);
  }

  toggleAccess(user: UserResponse) {
    return this.http.put<any>(`${this.baseUrl}/Usuario/Acceso`, {
      iIdUsuario: user.iIdUsuario,
      lAcceso: !user.lAcceso
    });
  }

}