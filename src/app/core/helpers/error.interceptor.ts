import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/store/Authentication/authentication.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
  constructor(private store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {

        if (err.status === 401) {
          // Auto logout via NgRx
          this.store.dispatch(logout());
        }

        const message = err?.error?.message || err?.error?.statusText || err?.statusText || 'An error occurred';
        return throwError(() => ({ message, status: err?.status, error: err?.error }));
      })
    );
  }
}

export const errorInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];
