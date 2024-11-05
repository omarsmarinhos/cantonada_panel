import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.scss'
})
export class CustomSnackbarComponent {
  icon: string = 'icons/check.svg';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    readonly snackBarRef: MatSnackBarRef<CustomSnackbarComponent> // Inyecta la referencia del snackbar
  ) {
    this.setIcon();
  }

  setIcon() {
    switch (this.data.type) {
      case 'success':
        this.icon = 'icons/success.svg';
        break;
      case 'error':
        this.icon = 'icons/error.svg';
        break;
      case 'warning':
        this.icon = 'icons/warning.svg';
        break;
      default:
        this.icon = 'icons/check.svg';
        break;
    }
  }

  closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
