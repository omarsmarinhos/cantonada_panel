import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Branch } from '../../../shared/models/Branch.model';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-branch-card',
  standalone: true,
  imports: [
    CommonModule,
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
  @Output() toggle = new EventEmitter<Branch>();

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  isAdmin = this.authService.isAdmin();

  onToggleStore() {
    this.toggle.emit(this.branch);
  }

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