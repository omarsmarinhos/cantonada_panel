import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Reservation } from '../../../shared/models/reservation.model';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';
import { ReservationService } from '../../../shared/services/reservation.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ReservationCardRejectModalComponent } from '../reservation-card-reject-modal/reservation-card-reject-modal.component';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CapitalizePipe,
    MatTooltipModule,
    TimeFormatPipe
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss'
})
export class ReservationCardComponent {

  @Input({ required: true }) reservation!: Reservation;
  @Output() reload = new EventEmitter<void>();

  private readonly reservationService = inject(ReservationService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);

  approveReservation(iIdReserva: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Aprobar Reserva',
        desc: '¿Estás seguro de que deseas aprobar esta reserva?',
        action: 'Aprobar'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reservationService.approveReservation(iIdReserva).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.reload.emit();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        });
      }
    });
  }

  openRejectReservationModal(reservation: Reservation) {
    const dialogRef = this.dialog.open(ReservationCardRejectModalComponent, {
      data: reservation,
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reload.emit();
      }
    });
  }
}
