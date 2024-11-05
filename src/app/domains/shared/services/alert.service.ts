import { inject, Injectable } from '@angular/core';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  readonly snackbar = inject(MatSnackBar);

  constructor() {}

  showSuccess(message: string, duration: number = 3000) {
    this.showNotification(message, 'success', duration);
  }

  showError(message: string, duration: number = 3000) {
    this.showNotification(message, 'error', duration);
  }

  showWarning(message: string, duration: number = 3000) {
    this.showNotification(message, 'warning', duration);
  }

  private showNotification(message: string, type: string, duration: number) {
    this.snackbar.openFromComponent(CustomSnackbarComponent, {
      data: { message, type },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification-snackbar', type],
    });
  }
}
