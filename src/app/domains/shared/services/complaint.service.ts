import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ComplaintBranchResponse } from '../models/complaint-branch-response.model';
import { PaginatedRequest } from '../models/paginated-request.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Complaint } from '../models/complaint.model';
import { TypeComplaint } from '../models/type-complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getBranches() {
    return this.http.get<ComplaintBranchResponse[]>(`${this.baseUrl}/Reclamacion`);
  }

  getComplaints(request: PaginatedRequest) {
    return this.http.post<PaginatedResponse<Complaint[]>>(`${this.baseUrl}/Reclamacion`, request);
  }

  getTypeComplaints() {
    return this.http.get<TypeComplaint[]>(`${this.baseUrl}/Reclamacion/Tipos`);
  }

  sendReply(iIdReclamacion: number, tRespuesta: string) {
    return this.http.put<any>(`${this.baseUrl}/Reclamacion/Responder`, {
      iIdReclamacion: iIdReclamacion,
      tRespuesta: tRespuesta
    });
  }
}
