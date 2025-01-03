import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Order } from '../../../shared/models/Order.model';
import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../../shared/services/auth.service';
import { OrderService } from '../../../shared/services/order.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { OrderCancelRequest } from '../../../shared/models/order-cancel-request.model';

@Component({
  selector: 'app-order-card-cancel-order-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './order-card-cancel-order-modal.component.html',
  styleUrl: './order-card-cancel-order-modal.component.scss'
})
export class OrderCardCancelOrderModalComponent {

  readonly order = inject<Order>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly errorService = inject(ErrorHandlerService);

  currentUser = this.authService.user();
  reason: string = '';

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {

    if (!this.reason || this.reason.trim() === "") {
      this.alertService.showWarning("El campo está vacío o contiene solo espacios en blanco.");
      return;
    }

    if (this.reason.length < 10 || this.reason.length > 255) {
      this.alertService.showWarning("El campo debe tener entre 10 y 255 caracteres");
      return;
    }

    const request: OrderCancelRequest = {
      iIdPedido: this.order.iIdPedido,
      iIdPedidoFast: this.order.iIdPedidoFast,
      iIdMotivoAnulacion: 1, //global
      iIdUsuario: 1, //global
      lFast: this.currentUser?.lFast!,
      tMotivoAnulacion: this.reason 
    }

    this.submit(request)
  }

  submit(request: OrderCancelRequest) {
    this.orderService.cancelOrder(request).subscribe({
      next: (res) => {
        this.alertService.showSuccess("Pedido anulado correctamente.")
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }
}
