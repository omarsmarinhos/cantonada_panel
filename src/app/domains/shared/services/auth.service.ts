import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { AuthIndexedDBService } from './auth-indexed-db.service';
import { AlertService } from './alert.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly dbService = inject(AuthIndexedDBService);
  private readonly alertService = inject(AlertService);
  private initialized = false;

  user = signal<User | null>(null)

  constructor() { }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.dbService.initializeDB();
      await this.loadUserData();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing user service:', error);
      this.alertService.showWarning(
        "Hubo un problema al cargar los datos del usuario"
      );
    }
  }

  private async loadUserData(): Promise<void> {
    const [user] = await Promise.all([
      this.dbService.getUser()
    ])

    this.user.set(user);
  }

  login(username: string, password: string) {
    return this.http.post<User>(`${this.baseUrl}/Seguridad/Token`, { username: username, password: password });
  }

  async setUser(user: User) {
    try {
      await this.dbService.saveUser(user)
      this.user.set(user);
      this.router.navigate(['/']);
      console.log("asd")
    } catch (error) {
      console.error('Error setting user:', error);
      this.alertService.showWarning(
        "No se pudo establecer el usuario."
      );
    }
  }

  async logout() {
    try {
      await this.dbService.clearUserData();
      this.user.set(null);
      this.router.navigate(['/auth']);
    } catch (error) {
      console.error('Error during logout:', error);
      this.alertService.showWarning(
        "Hubo un problema al cerrar sesión"
      );
    }
  }

}
