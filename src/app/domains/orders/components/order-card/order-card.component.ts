import { Component, inject, Input } from '@angular/core';
import { Order } from '../../../shared/models/Order.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { MatDialog } from '@angular/material/dialog';
import { OrderCardCustomerModalComponent } from '../order-card-customer-modal/order-card-customer-modal.component';
import { OrderCardCancelOrderModalComponent } from '../order-card-cancel-order-modal/order-card-cancel-order-modal.component';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    UpperCasePipe,
    CapitalizePipe,
    MatTooltipModule
  ],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {

  @Input({ required: true }) order!: Order;
  
  private readonly dialog = inject(MatDialog);

  openModalCustomerData(order: Order) {
    this.dialog.open(OrderCardCustomerModalComponent, {
      data: order,
      width: '500px'
    });
  }

  openModalCancelOrder(order: Order) {
    this.dialog.open(OrderCardCancelOrderModalComponent, {
      data: order,
      width: '500px'
    });
  }  

}
