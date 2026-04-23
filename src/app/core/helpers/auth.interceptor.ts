import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Pata token kutoka localStorage
    const token = localStorage.getItem('token');

    // Clone request na attach Authorization header ikiwa token ipo
    let authReq = req;
    if (token) {
      // Hakikisha token ina "Bearer " mbele
      authReq = req.clone({
        setHeaders: {
          Authorization: token.startsWith('Bearer') ? token : `Bearer ${token}`
        }
      });
    }

    // Handle response errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Ikiwa 401 Unauthorized, clear storage na redirect login
        if (error.status === 401) {
          console.log('401 detected, clearing storage and redirecting to /auth');
          localStorage.clear();
          this.router.navigate(['/auth']);
        }
        return throwError(() => error);
      })
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];