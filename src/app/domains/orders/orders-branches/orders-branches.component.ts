import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { OrderBranchResponse } from '../../shared/models/order-branch-response.model';
import { OrderBranchCardComponent } from "../components/order-branch-card/order-branch-card.component";

@Component({
  selector: 'app-orders-branches',
  standalone: true,
  imports: [OrderBranchCardComponent],
  templateUrl: './orders-branches.component.html',
  styleUrl: './orders-branches.component.scss'
})
export default class OrdersBranchesComponent {
  private readonly orderService = inject(OrderService);
  private readonly errorService = inject(ErrorHandlerService);

  branches = signal<OrderBranchResponse[]>([]);

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.orderService.getBranches().subscribe({
      next: (res) => {
        this.branches.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    })
  }
}
