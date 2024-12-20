import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedRequest } from '../models/paginated-request.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { UserResponse } from '../models/user-response.model';
import { UserRequest } from '../models/user-request.model';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getUsers(request: PaginatedRequest) {
    return this.http.post<PaginatedResponse<UserResponse[]>>(`${this.baseUrl}/Usuario/Paginado`, request);
  }

  getRoles() {
    return this.http.get<Role[]>(`${this.baseUrl}/Usuario/Roles`)
  }

  addUser(request: UserRequest) {
    return this.http.post<any>(`${this.baseUrl}/Usuario`, request);
  }

  editUser(request: UserRequest) {
    return this.http.put<any>(`${this.baseUrl}/Usuario`, request);
  }

  delete(iIdUsuario: number) {
    return this.http.delete<any>(`${this.baseUrl}/Usuario/${iIdUsuario}`);
  }

  toggleAccess(user: UserResponse) {
    return this.http.put<any>(`${this.baseUrl}/Usuario/Acceso`, {
      iIdUsuario: user.iIdUsuario,
      lAcceso: !user.lAcceso
    });
  }

}