import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Complaint } from '../../../shared/models/complaint.model';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ComplaintDetailModalComponent } from '../complaint-detail-modal/complaint-detail-modal.component';

@Component({
  selector: 'app-complaint-detail-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CapitalizePipe,
    MatTooltipModule
  ],
  templateUrl: './complaint-detail-card.component.html',
  styleUrl: './complaint-detail-card.component.scss'
})
export class ComplaintDetailCardComponent {

  @Input({ required: true }) complaint!: Complaint;
  @Output() reloadComplaint = new EventEmitter<void>();

  private readonly dialog = inject(MatDialog);

  openModal() {
    const dialogRef = this.dialog.open(ComplaintDetailModalComponent, {
      data: this.complaint,
      width: '1024px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadComplaint.emit();
      }
    })
  }
}
