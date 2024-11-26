import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Promotion } from '../../../shared/models/Promotion.model';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-promotion-details-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    CapitalizePipe,
    MatListModule
  ],
  templateUrl: './promotion-details-modal.component.html',
  styleUrl: './promotion-details-modal.component.scss'
})
export class PromotionDetailsModalComponent {

  private readonly dialogRef = inject(MatDialogRef<this>);
  readonly promotion = inject<Promotion>(MAT_DIALOG_DATA);

  details = signal<{ id: number, nombre: string, line?: number }[]>([])

  constructor() {
    if (this.promotion.tTipoAplicacion !== 'todo') {
      this.details.set(JSON.parse(this.promotion.jDetalles));
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
