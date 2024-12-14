import { Component, inject } from '@angular/core';
import { Order } from '../../../shared/models/Order.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-order-card-customer-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    ClipboardModule
  ],
  templateUrl: './order-card-customer-modal.component.html',
  styleUrl: './order-card-customer-modal.component.scss'
})
export class OrderCardCustomerModalComponent {

  readonly order = inject<Order>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);

  onCancel() {
    this.dialogRef.close();
  }

  copy() {
    this.alertService.showSuccess("Enlace de Google Maps copiado.")
  }
}
