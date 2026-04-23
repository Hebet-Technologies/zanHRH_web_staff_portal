import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {}
  
  public getPersonalInformation(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}getEmployeeDetail/${id}`);
  }
  public updatePersonalInfor(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}updatePersonalInfo`,data);
  }

  // general
  public getEducationLevel(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}educationLevels`)
  }
  public getCountries(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}countries`)
  }
  public getInstitutes(country_code: any, levelId: any): Observable<any>{
    return this.http.get(`${environment.apiUrl}getInstitutes/${country_code}/${levelId}`);
  }
  getPrograms(levelId: any): Observable<any>{
    return this.http.get(`${environment.apiUrl}getProgramByEducationLevel/${levelId}`);
  }
  public getHobbies(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}hobbies`);
  }
  public getSkills(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}skills`);
  }
  public getLanguages(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}languages`);
  }
  public getRelation(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}relations`);
  }
  getDistrict(): Observable<any>{
    return this.http.get(`${environment.apiUrl}getDistrictsPublic`);
  }
  getShehia(districtId: any): Observable<any>{
    return this.http.get(`${environment.apiUrl}getShehiasByDistrictUuid/${districtId}`);
  }
  getIdentificationType(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getIdentificationTypes`);
  }
  public getUploadType(data: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}getEmployeeUploadTypes`,data);
  }
  public getMeritalStatus(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}maritalStatus`);
  }
  public getShehiaProfile(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}getShehias`);
  }
  public getAllBanks(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}banks`)
  }


  // educational based
  public getEducations(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}personalEducations/${id}`);
  }
  public saveEducation(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}personalEducations`, data);
  }
  public deleteEducation(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}personalEducations/${id}`);
  }

  //Work Experience
  public getWorkExperience(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}personalExperiences/${id}`);
  }
  public saveWorkExperience(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}personalExperiences`, data);
  }
  public deleteWorkExperience(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}personalExperiences/${id}`);
  }

  //Hobbies / Interests
  public getHobbiesOrInterests(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}personalHobbies/${id}`);
  }
  public saveHobbiesOrInterests(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}personalHobbies`, data);
  }
  public deleteHobbiesOrInterests(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}personalHobbies/${id}`);
  }

  // Skills
  public getAllSkills(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}personalSkills/${id}`);
  }
  public saveSkills(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}personalSkills`, data);
  }
  public deleteSkills(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}personalSkills/${id}`);
  }

  //language
  public getAllLanguage(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}personalLanguages/${id}`);
  }
  public saveLanguage(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}personalLanguages`, data);
  }
  public deleteLanguage(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}personalLanguages/${id}`);
  }

  // Next of Kins
  public getAllNextOfKins(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}personalNextKins/${id}`);
  }
  public saveNextOfKins(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}personalNextKins`, data);
  }
  public deleteNextOfKins(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}personalNextKins/${id}`);
  }

  //REFEREE
  public getAllReferee(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}personalRefferees/${id}`);
  }
  public saveReferee(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}personalRefferees`, data);
  }
  public deleteReferee(id:any): Observable<any>{
    return this.http.delete(`${environment.apiUrl}personalRefferees/${id}`);
  }

  //Attachments
  public getPersonalAttachement(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}personalAttachments/${id}`);
  }
  public savePersonalAttachement(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}personalAttachments`,data);
  }
  public deleteAttachement(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}personalAttachments/${id}`);
  }
 
}
