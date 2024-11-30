import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  private readonly router = inject(Router);

  constructor() { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.isTokenExpired(token)) {
        this.router.navigate(['/auth']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }

  private isTokenExpired(token: string): boolean {
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
}

export interface DecodedToken {
  exp: number;
  [key: string]: any;
}
