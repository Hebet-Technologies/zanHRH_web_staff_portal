import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private http: HttpClient) {}

  //employee training data
  public getAllTraining(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}viewStaffTrainingRequest`,data);
  }
  public getTrainingAnnoucement(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}getPublishedDevelopmentPlanCurrentYear`);
  }
  public storeTraining(data: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}storeTrainingRequest`, data);
  }
  public deleteTraining(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}destroyStaffTrainingRequest/${id}`);
  }
  public getCountries(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}countries`)
  }
  public getInstitutes(country_code: any, levelId: any): Observable<any>{
    return this.http.get(`${environment.apiUrl}getInstitutes/${country_code}/${levelId}`);
  }
  public uploadTrainingAdmisionLaterApi(data: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}uploadTrainingAdmissionLatter`, data);
  }

  //print approved data
  getTrainingApprovedLetter(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}getTrainingLetter/${id}`, {
    responseType: 'blob'
    });
  }
}
