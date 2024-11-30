import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  constructor() { }

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Seguridad/Token`, { username: username, password: password })
      .pipe(
        tap(response => {
          if (response) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/auth']);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}

export interface AuthResponse {
  id: number;
  username: string;
  mensaje: string;
  token: string;
}
