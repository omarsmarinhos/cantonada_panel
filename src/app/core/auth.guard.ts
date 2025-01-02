import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlertService } from '../domains/shared/services/alert.service';
import { AuthService } from '../domains/shared/services/auth.service';

export const privateGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const token = authService.user()?.token;
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
    const authService = inject(AuthService);
    const token = authService.user()?.token;
    if (token && !isTokenExpired(token)) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
};

export const adminGuard = (allowedRoles: string[]): CanMatchFn => {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const alertService = inject(AlertService);
    const token = authService.user()?.token;
    if (token) {
      if (isTokenExpired(token)) {
        alertService.showWarning("Su tiempo de sesión ha expirado.")
        router.navigate(['/auth']);
        return false;
      }

      if (!allowedRoles) {
        console.error('No se encontraron roles permitidos en la ruta.');
        return false;
      }

      const userRole = authService.user()?.rol;

      if (!allowedRoles.includes(userRole!)) {
        router.navigate(['/']);
        return false;
      }

      return true;
    }

    router.navigate(['/auth']);
    return false;
  };
};

export const isAuthorizedForBranch = (): CanMatchFn => {
  return (route, segments) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const alertService = inject(AlertService);
    const token = authService.user()?.token;

    if (!token) {
      router.navigate(['/auth']);
      return false;
    }

    if (isTokenExpired(token)) {
      alertService.showWarning("Su tiempo de sesión ha expirado.");
      router.navigate(['/auth']);
      return false;
    }

    const idSucursalUser = authService.getIdSucursal();
    const requestedBranchId = Number(segments[segments.length - 1].path);

    if (idSucursalUser === null) {
      return true;
    }

    if (idSucursalUser === requestedBranchId) {
      return true;
    }

    router.navigate(['/']);
    return false;
  }
}

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
