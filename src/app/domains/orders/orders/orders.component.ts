import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { OrderCardComponent } from "../components/order-card/order-card.component";
import { Component, inject, Input, signal } from "@angular/core";
import { OrderService } from "../../shared/services/order.service";
import { AlertService } from "../../shared/services/alert.service";
import { Order } from "../../shared/models/Order.model";
import { ErrorHandlerService } from "../../shared/services/error-handler.service";
import { WebsocketService } from "../../shared/services/websocket.service";
import { NotificationSoundService } from "../../shared/services/notification-sound.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

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

  @Input() id?: string;

  private readonly orderService = inject(OrderService);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly websocketService = inject(WebsocketService);
  private readonly notificationSound = inject(NotificationSoundService);
  private readonly router = inject(Router);
  private webSocketNewOrderSub: Subscription | undefined;
  private webSocketChangeStatusSub: Subscription | undefined;

  orders = signal<Order[]>([]);
  totalItems = signal(0);
  selectedStatus: string = '';
  searchQuery: string = '';
  currentPage: number = 1;
  selectedTypeDelivery: string = '';
  currentBranch: string = '';

  ngOnInit() {
    if (this.id) {
      this.loadOrders();
      this.webSocketNewOrderSub = this.websocketService.onNewOrder().subscribe({
        next: (data) => {
          if (data.branchId === parseInt(this.id!)) {
            console.log('Nuevo pedido recibido:', data);
            this.notificationSound.play();
            this.alertService.showSuccess(`Nuevo Pedido Recibido en ${this.currentBranch}`)
            this.loadOrders();
          }
        }
      });
      this.webSocketChangeStatusSub = this.websocketService.onChangeOrderStatus().subscribe({
        next: (data) => {
          if (this.websocketService.socketChangeOrderStatusInit) {
            console.log('Pedido actualizado:', data);
            this.notificationSound.play();
            this.alertService.showSuccess("Se actualizo el estado de un pedido.")
            this.loadOrders();
          } else {
            console.log("Socket fast iniciado.")
          }
          this.websocketService.socketChangeOrderStatusInit = true;
        }
      });
    }

  }

  loadOrders() {
    this.orderService.getOrders({
      iPageNumber: 1,
      iPageSize: 12,
      iIdSucursal: parseInt(this.id!),
      tSearch: this.searchQuery,
      tEstado: this.selectedStatus,
      tTipoEntrega: this.selectedTypeDelivery
    }).subscribe({
      next: (res) => {
        this.orders.set(res.data);
        this.totalItems.set(res.totalRecords);
        this.currentBranch = res.tSucursal;
      },
      error: (err) => {
        this.errorService.showError(err);
        this.goToOrderBranchPage();
      }
    })
  }

  goToOrderBranchPage() {
    this.router.navigate(["/pedidos"]);
  }

  ngOnDestroy() {
    if (this.webSocketNewOrderSub) {
      this.webSocketNewOrderSub.unsubscribe();
    }
    if (this.webSocketChangeStatusSub) {
      this.webSocketChangeStatusSub.unsubscribe();
    }
  }

}
