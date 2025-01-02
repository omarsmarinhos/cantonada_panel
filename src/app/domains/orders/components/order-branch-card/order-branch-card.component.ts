import { Component, inject, Input } from '@angular/core';
import { OrderBranchResponse } from '../../../shared/models/order-branch-response.model';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-order-branch-card',
  standalone: true,
  imports: [
    UpperCasePipe,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './order-branch-card.component.html',
  styleUrl: './order-branch-card.component.scss'
})
export class OrderBranchCardComponent {

  @Input({ required: true }) branch!: OrderBranchResponse;

  private readonly router = inject(Router);

  onGotoOrdersByBranch(iIdSucursal: number) {
    this.router.navigate(['/pedidos', iIdSucursal]);
  }
}
