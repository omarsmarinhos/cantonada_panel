import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { OrderCardComponent } from "./components/order-card/order-card.component";
import { Component, inject, signal } from "@angular/core";
import { OrderService } from "../shared/services/order.service";
import { AlertService } from "../shared/services/alert.service";
import { Order } from "../shared/models/Order.model";
import { ErrorHandlerService } from "../shared/services/error-handler.service";

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


  orders = signal<Order[]>([]);

  ngOnInit() {
    this.loadOrders();
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
