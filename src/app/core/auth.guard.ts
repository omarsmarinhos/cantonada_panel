import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlertService } from '../domains/shared/services/alert.service';

export const privateGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');
    const alertService = inject(AlertService);

    if (token) {
      if (isTokenExpired(token)) {
        alertService.showWarning("Su tiempo de sesión ha expirado.")
        router.navigate(['/auth']);
        return false;
      }
      return true;
    }

    router.navigate(['/auth']);
    return false;
  };
};

export const publicGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
};



const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);

    if (!decodedToken.exp) {
      return true;
    }

    const expirationDate = new Date(decodedToken.exp * 1000);
    const isExpired = expirationDate.getTime() <= new Date().getTime();


    return isExpired;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }

}

export interface DecodedToken {
  exp: number;
  [key: string]: any;
}
