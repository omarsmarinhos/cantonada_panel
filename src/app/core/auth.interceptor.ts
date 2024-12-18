import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AlertService } from '../domains/shared/services/alert.service';
import { AuthService } from '../domains/shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.user()?.token;
    let clonedReq = req;

    if (token) {
      clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.alertService.showWarning('Tu sesión ha expirado. Inicia sesión nuevamente.', 5000);
          console.log('Token expirado o no válido. Redirigiendo al login...');
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}