import { Component, inject, Input, signal } from '@angular/core';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { ComplaintService } from '../shared/services/complaint.service';
import { AlertService } from '../shared/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { Complaint } from '../shared/models/complaint.model';
import { TypeComplaint } from '../shared/models/type-complaint.model';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ComplaintDetailCardComponent } from "./components/complaint-detail-card/complaint-detail-card.component";
import { PaginationComponent } from "../customers/components/pagination/pagination.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';

@Component({
  selector: 'app-complaints-detail',
  standalone: true,
  imports: [
    UpperCasePipe,
    ComplaintDetailCardComponent,
    PaginationComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    CapitalizePipe
  ],
  templateUrl: './complaints-detail.component.html',
  styleUrl: './complaints-detail.component.scss'
})
export default class ComplaintsDetailComponent {

  @Input() id?: string;

  private readonly errorService = inject(ErrorHandlerService);
  private readonly complaintService = inject(ComplaintService);
  private readonly alertService = inject(AlertService);
  private readonly dialog = inject(MatDialog)
  private readonly router = inject(Router);

  complaints = signal<Complaint[]>([]);
  typeComplaints = signal<TypeComplaint[]>([]);
  totalItems = signal(0);
  selectedStatus: string = '';
  searchQuery: string = '';
  currentPage: number = 1;
  selectedTypeComplaint: number = 0;
  currentBranch: string = '';

  constructor() { }

  ngOnInit() {
    if (this.id) {
      this.loadTypeComplaints();
      this.loadComplaints();
    }
  }

  loadTypeComplaints() {
    this.complaintService.getTypeComplaints().subscribe({
      next: (res) => {
        this.typeComplaints.set(res);
        console.log(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  loadComplaints() {
    this.complaintService.getComplaints({
      iPageNumber: 1,
      iPageSize: 6,
      iIdSucursal: parseInt(this.id!),
      tSearch: this.searchQuery,
      tEstado: this.selectedStatus,
      iIdTipoReclamacion: this.selectedTypeComplaint
    }).subscribe({
      next: (res) => {
        this.complaints.set(res.data);
        this.totalItems.set(res.totalRecords);
        this.currentBranch = res.tSucursal;
      },
      error: (err) => {
        this.goToBranchesDomain();
        this.errorService.showError(err);
      }
    });
  }

  goToBranchesDomain() {
    this.router.navigate(["/reclamaciones"]);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadComplaints();
  }

  onStatusChange() {
    this.loadComplaints();
  }

  onComplaintTypeChange() {
    this.loadComplaints();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadComplaints();
  }
}
