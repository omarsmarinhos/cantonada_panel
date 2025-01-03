import { Component, inject, Input } from '@angular/core';
import { ReservationBranchResponse } from '../../../shared/models/reservation-branch-response.model';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-reservation-branch-card',
  standalone: true,
  imports: [
    UpperCasePipe,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './reservation-branch-card.component.html',
  styleUrl: './reservation-branch-card.component.scss'
})
export class ReservationBranchCardComponent {

  @Input({ required: true }) branch!: ReservationBranchResponse;

  private readonly router = inject(Router);


  onGotoReservationsByBranch(iIdSucursal: number) {
    this.router.navigate(['/reservas', iIdSucursal]);
  }
}
