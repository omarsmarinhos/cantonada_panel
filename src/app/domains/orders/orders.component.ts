import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { OrderCardComponent } from "./components/order-card/order-card.component";
import { Component, inject, signal } from "@angular/core";
import { OrderService } from "../shared/services/order.service";
import { AlertService } from "../shared/services/alert.service";
import { Order } from "../shared/models/Order.model";
import { ErrorHandlerService } from "../shared/services/error-handler.service";
import { WebsocketService } from "../shared/services/websocket.service";
import { Subscription } from "rxjs";
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
  private wsSubscription: Subscription | undefined;

  orders = signal<Order[]>([]);

  ngOnInit() {
    this.loadOrders();
    this.wsSubscription = this.websocketService.onNewOrder().subscribe({
      next: (data) => {
        console.log('Nuevo pedido recibido:', data);
        this.notificationSound.play();
        this.alertService.showSuccess("Nuevo Pedido Recibido.")
        this.loadOrders();
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

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }
}
