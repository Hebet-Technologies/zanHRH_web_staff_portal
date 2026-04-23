import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, loadSearchEmployee, loadSearchEmployeeFailure, loadSearchEmployeeSuccess, addStaffRegistration, addStaffRegistrationFailure, addStaffRegistrationSuccess} from './authentication.actions';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/account/auth/signin/cover/toast-service';
import { AuthService } from 'src/app/core/services/auth-card/auth.service';

@Injectable()
export class AuthenticationEffects {

    constructor(
    private actions$: Actions,
    private _authService: AuthService,
    private router: Router,
    private toastService: ToastService // optional: show toast from effect
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) =>
        this._authService.loginAuthenticate({ email, password }).pipe(
          map((response: any) => {
            // Server returned error
            if (response?.error) {
              this.toastService.show(response.error, { classname: 'bg-danger text-white', delay: 5000 });
              return loginFailure({ error: response.error });
            }

            // Unauthorized
            if (response.statusCode === 401) {
              this.toastService.show('Invalid credentials', { classname: 'bg-danger text-white', delay: 5000 });
              return loginFailure({ error: 'Unauthorized' });
            }

            // Success
            if (response.data.statusCode === 200) {

              localStorage.setItem('token', `Bearer ${response.data.token}`);

              // User needs to change password
              if (response.data.login_status !== '1') {
                this.router.navigateByUrl('/auth/authfirst');
                return loginFailure({ error: 'Please change password first' });
              }

              // Normal login
              const user = {
                id: response.data.user_id,
                fullName: response.data.full_name,
                email: response.data.email,
                photo: response.data.photo,
                workingStationID: response.data.working_station_id,
                workingStationName: response.data.working_station_name,
                roleId: response.data.roles[0]?.id,
                roleName: response.data.roles[0]?.name,
                personalInformationID:response.data.personal_information_id,
                permissions: response.data.permissions,
              };

              localStorage.setItem('user', JSON.stringify(user));

              return loginSuccess({ user });
            }

            // Default fallback
            return loginFailure({ error: response.message || 'Unknown error' });

          }),
          catchError(() => {
            this.toastService.show('Server connection error', { classname: 'bg-danger text-white', delay: 5000 });
            return of(loginFailure({ error: 'Server connection error' }));
          })
        )
      )
    )
  );

  // Redirect after successful login
  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
          this.toastService.clear();
          // set sessionStorage kama toast
          localStorage.setItem('toast', 'true');

          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const permissions = user.permissions.map((p: any) => p.name);

          let defaultRoute = '/app/dashboard';

          if (permissions.includes('View Ps Dashboard')) {
            defaultRoute = '/app/dashboard/ps-dashboard-views';
          } else if (permissions.includes('Setup Management')) {
            defaultRoute = '/app/dashboard/staff-dashboard-views';
          }

          this.router.navigateByUrl(defaultRoute);
          
          
        })
      ),
    { dispatch: false }
  );

  // Logout effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        this._authService.logout().pipe(
          
          tap(() => {
            this.toastService.clear();
            this.router.navigateByUrl('/auth')
            localStorage.removeItem('toast');
            }),
          map(() => logoutSuccess())
        )
      )
    )
  );

  //hii ya kuselect data ikiwa katika fomati ya post na pia data zake za body ndio unaziweka katika api yenyewe
  loadSeachEployeeDatas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSearchEmployee),
      mergeMap(({ out_put_Data }) =>
        this._authService.searchEmployee({
          payroll: out_put_Data.payroll,
          date_of_birth: out_put_Data.date_of_birth,
        }).pipe(

          map((res: any) => {
            if (res.statusCode === 200) {
              return loadSearchEmployeeSuccess({
                search_list: res // au res kulingana na API yako
              });
            } else {
              return loadSearchEmployeeFailure({
                error: res.message || 'No data found'
              });
            }
          }),

          catchError(error =>
            of(loadSearchEmployeeFailure({ error }))
          )
        )
      )
    )
  );


  //add staff
  addStaffRegistrationForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addStaffRegistration),
      mergeMap(({ payload }) =>
        this._authService.registerStaff(payload).pipe(
          map((res: any) => {
            if (res.statusCode === 201) {
              return addStaffRegistrationSuccess();
            } else {
              return addStaffRegistrationFailure({
                error: res.message || 'No data found'
              });
            }
          }),
          catchError(error =>
            of(addStaffRegistrationFailure({ error }))
          )
        )
      )
    )
  );
  navigateAfterSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addStaffRegistrationSuccess),
        tap(() => {
          this.router.navigateByUrl('/auth');
        })
      ),
    { dispatch: false }
  );

  

  

}