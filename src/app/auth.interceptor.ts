import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from './domains/shared/services/alert.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
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
          localStorage.removeItem('token');
          this.router.navigate(['/auth']);
        }
        return throwError(() => error);
      })
    );
  }
}