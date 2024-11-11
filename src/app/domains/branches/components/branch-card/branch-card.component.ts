import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Branch } from '../../../shared/models/Branch.model';

@Component({
  selector: 'app-branch-card',
  standalone: true,
  imports: [
    MatIconModule,
    UpperCasePipe
  ],
  templateUrl: './branch-card.component.html',
  styleUrl: './branch-card.component.scss'
})
export class BranchCardComponent {
  @Input({ required: true }) branch!: Branch;
  @Output() edit = new EventEmitter<Branch>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.branch);
  }

  onDelete() {
    this.delete.emit(this.branch.iIdSucursal);
  }
}
