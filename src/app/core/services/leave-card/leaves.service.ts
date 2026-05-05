import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {

  constructor(private http: HttpClient) {}

  getAllLeaveRequest(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}viewStaffLeaveRequests`);
  }
  public getLeaveType(id:any): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}getLeaveType/${id}`);
  }
  public getPersonalInformation(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}getEmployeeDetail/${id}`);
  }
  public getRepresentative(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}getRepresentative`);
  }
  public getAllCountry(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}countries`);
  }
  public getLeaveHistory(id: any): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}viewStaffLeaveHistory/${id}`);
  }
  public createLeaveRequestForm(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}leaveRequests`, data);
  }
  public deleteLeaveForm(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}deleteleaveRequest/${id}`);
  }
  getLeaveLetter(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}getLeaveLetter/${id}`, {
    responseType: 'blob'
    });
  }
  public returnToWork(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}returnToWork`, data);
  }
  getLeaveReturnedToWorkLetter(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}viewReturnedToWorkLetter/${id}`, {
    responseType: 'blob'
    });
  }
  // managemet of leave request
  getStaffOnLeave(): Observable<any>{
    return this.http.get(`${environment.apiUrl}viewStaffOnLeave`);
  }
  getStaffWaitingLeave(): Observable<any>{
    return this.http.get(`${environment.apiUrl}viewStaffWaitingLeave`);
  }
  getStaffLeaveOverdue(): Observable<any>{
    return this.http.get(`${environment.apiUrl}viewStaffLeaveOverdue`);
  }
  getStaffLeaveRequestStage(): Observable<any>{
    return this.http.get(`${environment.apiUrl}viewLeaveRequests`);
  }
  getStaffDeniedRequest(): Observable<any>{
    return this.http.get(`${environment.apiUrl}viewStaffDeniedLeave`);
  }
  //general leave latter
  getGeneralLeaveLetter(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}getLeaveLetter/${id}`, {
    responseType: 'blob'
    });
  }
  getStaffBackToWork(): Observable<any>{
    return this.http.get(`${environment.apiUrl}viewReturnedToWork`);
  }
  saveConfirmReturnToWork(data: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}confirmReturnToWork`, data);
  }
  getLeaveRequestToApprove(): Observable<any>{
    return this.http.get(`${environment.apiUrl}viewLeaveToApprove`);
  }







}
