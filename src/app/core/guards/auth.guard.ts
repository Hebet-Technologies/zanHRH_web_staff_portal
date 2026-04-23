import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

// Auth Services
import { Store } from '@ngrx/store';
import { Observable, take, map } from 'rxjs';
import { selectIsLoggedIn } from 'src/app/store/Authentication/authentication-selector';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate{
    constructor(
        private store: Store,
        private router: Router
    ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store.select(selectIsLoggedIn).pipe(
      take(1),
      map(isLogged => {
        if (!isLogged) {
          this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
          return false;
        }
        return true;
      })
    );
  }
}
