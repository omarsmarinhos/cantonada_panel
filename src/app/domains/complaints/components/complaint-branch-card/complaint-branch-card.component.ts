import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ComplaintBranchResponse } from '../../../shared/models/complaint-branch-response.model';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-complaint-branch-card',
  standalone: true,
  imports: [
    UpperCasePipe,
    MatIconModule,
    MatBadgeModule
  ],
  templateUrl: './complaint-branch-card.component.html',
  styleUrl: './complaint-branch-card.component.scss'
})
export class ComplaintBranchCardComponent {

  @Input({ required: true }) branch!: ComplaintBranchResponse;

  private readonly router = inject(Router);

  onGoComplaintsByBranch(iIdSucursal: number) {
    this.router.navigate(['/reclamaciones', iIdSucursal]);
  }
}
