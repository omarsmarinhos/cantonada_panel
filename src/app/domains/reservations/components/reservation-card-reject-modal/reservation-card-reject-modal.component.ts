import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Reservation } from '../../../shared/models/reservation.model';
import { AlertService } from '../../../shared/services/alert.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { ReservationService } from '../../../shared/services/reservation.service';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';

@Component({
  selector: 'app-reservation-card-reject-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CapitalizePipe
  ],
  templateUrl: './reservation-card-reject-modal.component.html',
  styleUrl: './reservation-card-reject-modal.component.scss'
})
export class ReservationCardRejectModalComponent {

  readonly reservation = inject<Reservation>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly reservationService = inject(ReservationService);
  private readonly errorService = inject(ErrorHandlerService);

  tRechazo = '';

  constructor() {
    if (this.reservation.tRechazo) {
      this.tRechazo = this.reservation.tRechazo;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.tRechazo || this.tRechazo.trim() === "") {
      this.alertService.showWarning("El campo está vacío o contiene solo espacios en blanco.");
      return;
    }

    if (this.tRechazo.length < 10 || this.tRechazo.length > 255) {
      this.alertService.showWarning("El campo debe tener entre 10 y 1000 caracteres");
      return;
    }
    this.submit(this.reservation.iIdReserva, this.tRechazo);
  }

  submit(iIdReserva: number, tRechazo: string) {
    this.reservationService.rejectReservation(iIdReserva, tRechazo).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }
}
