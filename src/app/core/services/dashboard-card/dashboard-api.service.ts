import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {

  constructor(private http: HttpClient) {}
  

  //staff dashboard
  getStaffCountDashboardData(): Observable<any>{
    return this.http.get(`${environment.apiUrl}getStaffSummaryCards`);
  }
  public getAdvertisement(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getStaffAdvertisement`);
  }
  //namna ya kuget api ambayo ipo katika hali ya post
  public getApplication(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}getStaffAdvertisementApp`,data);
  }
  //end
  public getAdvertWorkPlace(id: any): Observable<any>{
    return this.http.get(`${environment.apiUrl}staffAdverPositions/${id}`);
  }
  public getAdvertPrograms(id: any): Observable<any>{
    return this.http.get(`${environment.apiUrl}getStaffAdverProgram/${id}`);
  }
  public saveAdvertisement(data: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}storeAdverRequest`,data);
  }
  public deleteApplication(id: any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}deleteStaffAdverApplication/${id}`);
  }

  //end
}
