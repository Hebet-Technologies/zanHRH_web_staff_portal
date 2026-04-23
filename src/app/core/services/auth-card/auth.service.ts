import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loginSuccess } from 'src/app/store/Authentication/authentication.actions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private store: Store) {}

  loginAuthenticate(data: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}login`, data);
  }

  logout(): Observable<null> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return new Observable(observer => {
      observer.next(null);
      observer.complete();
    });
  }

  initAuth() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      const user = JSON.parse(userJson);

      localStorage.removeItem('toast');
      // Dispatch loginSuccess ili set store
      this.store.dispatch(loginSuccess({ user }));
    }
  }

  public searchEmployee(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}getPersonalInfo`, data);
  }

  public registerStaff(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}createAccount`, data);
  }
}
