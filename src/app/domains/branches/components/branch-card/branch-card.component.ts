import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Branch } from '../../../shared/models/Branch.model';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-branch-card',
  standalone: true,
  imports: [
    MatIconModule,
    UpperCasePipe,
    MatTooltip
  ],
  templateUrl: './branch-card.component.html',
  styleUrl: './branch-card.component.scss'
})
export class BranchCardComponent {
  @Input({ required: true }) branch!: Branch;
  @Output() edit = new EventEmitter<Branch>();
  @Output() delete = new EventEmitter<number>();

  private readonly router = inject(Router);

  onEdit() {
    this.edit.emit(this.branch);
  }

  onDelete() {
    this.delete.emit(this.branch.iIdSucursal);
  }

  onGoZone(iIdSucursal: number) {
    this.router.navigate(['/zonas', iIdSucursal]);
  }
}
