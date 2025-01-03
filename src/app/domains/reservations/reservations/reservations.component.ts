import { UpperCasePipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { PaginationComponent } from '../../customers/components/pagination/pagination.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { AlertService } from '../../shared/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Reservation } from '../../shared/models/reservation.model';
import { TypeReservation } from '../../shared/models/type-reservation.model';
import { ReservationService } from '../../shared/services/reservation.service';
import { ReservationCardComponent } from "../components/reservation-card/reservation-card.component";

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    UpperCasePipe,
    PaginationComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    CapitalizePipe,
    ReservationCardComponent
],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export default class ReservationsComponent {

  @Input() id?: string;

  private readonly errorService = inject(ErrorHandlerService);
  private readonly reservationsService = inject(ReservationService);
  private readonly alertService = inject(AlertService);
  private readonly dialog = inject(MatDialog)
  private readonly router = inject(Router);

  reservations = signal<Reservation[]>([]);
  typeReservations = signal<TypeReservation[]>([])
  totalItems = signal(0);
  selectedStatus = '';
  searchQuery = '';
  currentPage = 1;
  selectedTypeReservation = 0;
  currentBranch = '';

  ngOnInit() {
    if (this.id) {
      this.loadTypeReservations();
      this.loadReservations();
    }
  }

  loadTypeReservations() {
    this.reservationsService.getTypeReservations().subscribe({
      next: (res) => {
        this.typeReservations.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  loadReservations() {
    this.reservationsService.getReservations({
      iPageNumber: this.currentPage,
      iPageSize: 6,
      iIdSucursal: parseInt(this.id!),
      tSearch: this.searchQuery,
      tEstado: this.selectedStatus,
      iIdMotivoReserva: this.selectedTypeReservation
    }).subscribe({
      next: (res) => {
        this.reservations.set(res.data);
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
    this.router.navigate(["/reservas"]);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadReservations();
  }

  onStatusChange() {
    this.loadReservations();
  }

  onReservationTypeChange() {
    this.loadReservations();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadReservations();
  }
}