import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedRequest } from '../models/paginated-request.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { ReservationBranchResponse } from '../models/reservation-branch-response.model';
import { TypeReservation } from '../models/type-reservation.model';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getBranches() {
    return this.http.get<ReservationBranchResponse[]>(`${this.baseUrl}/Reserva`);
  }

  getReservations(request: PaginatedRequest) {
    return this.http.post<PaginatedResponse<Reservation[]>>(`${this.baseUrl}/Reserva`, request);
  }

  getTypeReservations() {
    return this.http.get<TypeReservation[]>(`${this.baseUrl}/Reserva/Motivos`);
  }

  approveReservation(iIdReserva: number) {
    return this.http.post<any>(`${this.baseUrl}/Reserva/Aprobar?iIdReserva=${iIdReserva}`, null); 
  }

  rejectReservation(iIdReserva: number, tRechazo: string) {
    return this.http.post<any>(`${this.baseUrl}/Reserva/Rechazar`, {
      iIdReserva: iIdReserva,
      tRechazo: tRechazo
    }); 
  }
}
