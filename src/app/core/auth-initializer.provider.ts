import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from '../domains/shared/services/auth.service';

export function initializeAuth(authService: AuthService) {
  return () => authService.initialize();
}

export const AUTH_INITIALIZER = {
  provide: APP_INITIALIZER,
  useFactory: initializeAuth,
  deps: [AuthService],
  multi: true
};