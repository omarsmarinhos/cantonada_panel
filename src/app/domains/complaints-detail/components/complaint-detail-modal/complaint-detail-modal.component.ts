import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Complaint } from '../../../shared/models/complaint.model';
import { AlertService } from '../../../shared/services/alert.service';
import { UpperCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ComplaintService } from '../../../shared/services/complaint.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Component({
  selector: 'app-complaint-detail-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    UpperCasePipe,
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './complaint-detail-modal.component.html',
  styleUrl: './complaint-detail-modal.component.scss'
})
export class ComplaintDetailModalComponent {

  readonly complaint = inject<Complaint>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly complaintService = inject(ComplaintService);

  tRespuesta: string = '';

  constructor() {
    if (this.complaint.tRespuesta) {
      this.tRespuesta = this.complaint.tRespuesta;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.tRespuesta.length < 20 || this.tRespuesta.length > 1000) {
      this.alertService.showWarning('La repuesta debe tener entre 20 y 1000 caracteres.');
      return;
    }

    this.submit();
  }

  submit() {
    this.complaintService.sendReply(this.complaint.iIdReclamacion, this.tRespuesta).subscribe({
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
