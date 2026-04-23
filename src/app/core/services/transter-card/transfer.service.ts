import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private http: HttpClient) {}

  getAllTransfere(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}viewStaffTransferSequence`);
  }
  public createRequestTransfere(data: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}staffTransferRequests`, data);
  }
  public deleteTransfer(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}deleteStaffTransfer/${id}`)
  }




  public getWorkStation(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}getAllWorkingStations`);
  }
  public getTransfereReason(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}staffTransferReasons`)
  }
  
}
