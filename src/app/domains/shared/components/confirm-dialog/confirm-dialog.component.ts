import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>)
  readonly data = inject<{
    title?: string,
    desc?: string,
    action?: string,
  }>(MAT_DIALOG_DATA);

  title = this.data?.title ?? 'Confirmar eliminación';
  desc = this.data?.desc ?? '¿Estás seguro de que deseas eliminar este elemento?';
  action = this.data?.action ?? 'Eliminar';

  constructor() { }
}
