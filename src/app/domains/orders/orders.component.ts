import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { OrderCardComponent } from "./components/order-card/order-card.component";
import { Component, inject, signal } from "@angular/core";
import { OrderService } from "../shared/services/order.service";
import { AlertService } from "../shared/services/alert.service";
import { Order } from "../shared/models/Order.model";
import { ErrorHandlerService } from "../shared/services/error-handler.service";
import { WebsocketService } from "../shared/services/websocket.service";
import { NotificationSoundService } from "../shared/services/notification-sound.service";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    OrderCardComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export default class OrdersComponent {

  private readonly orderService = inject(OrderService);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly websocketService = inject(WebsocketService);
  private readonly notificationSound = inject(NotificationSoundService);

  orders = signal<Order[]>([]);

  ngOnInit() {
    this.loadOrders();
    this.websocketService.onNewOrder().subscribe({
      next: (data) => {
        console.log('Nuevo pedido recibido:', data);
        this.notificationSound.play();
        this.alertService.showSuccess("Nuevo Pedido Recibido.")
        this.loadOrders();
      }
    });
    this.websocketService.onChangeOrderStatus().subscribe({
      next: (data) => {
        if (this.websocketService.socketChangeOrderStatusInit) {
          console.log('Pedido actualizado:', data);
          this.notificationSound.play();
          this.alertService.showSuccess("Se actualizo el estado de un pedido.")
          this.loadOrders();
        } else {
          console.log("Socket fast iniciado.")
        }
      }
    });
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    })
  }

}
