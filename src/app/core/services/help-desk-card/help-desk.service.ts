import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Talks to the `/help-desk/*` API consumed by help desk admins on the core web.
 * The auth token is attached by the global HTTP interceptor.
 */
@Injectable({ providedIn: 'root' })
export class HelpDeskService {
  private readonly base = `${environment.apiUrl}help-desk`;

  constructor(private http: HttpClient) {}

  // ---- Dashboard ----------------------------------------------------------
  getStatistics(filters: {
    category_uuid?: string;
    from?: string;
    to?: string;
  } = {}): Observable<any> {
    return this.http.get<any>(`${this.base}/statistics`, {
      params: this.toParams(filters),
    });
  }

  // ---- Categories ---------------------------------------------------------
  getCategories(search?: string): Observable<any> {
    return this.http.get<any>(`${this.base}/categories`, {
      params: this.toParams({ search, perPage: 100 }),
    });
  }

  getCategory(uuid: string): Observable<any> {
    return this.http.get<any>(`${this.base}/categories/${uuid}`);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/categories`, data);
  }

  updateCategory(uuid: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/categories/${uuid}`, data);
  }

  deleteCategory(uuid: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/categories/${uuid}`);
  }

  // ---- Agents -------------------------------------------------------------
  getAgents(categoryUuid: string): Observable<any> {
    return this.http.get<any>(`${this.base}/categories/${categoryUuid}/agents`);
  }

  saveAgents(categoryUuid: string, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.base}/categories/${categoryUuid}/agents`,
      data
    );
  }

  removeAgent(categoryUuid: string, userId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.base}/categories/${categoryUuid}/agents/${userId}`
    );
  }

  // ---- Tickets ------------------------------------------------------------
  getTickets(filters: {
    scope?: string;
    status?: string;
    priority?: string;
    category_uuid?: string;
    search?: string;
    perPage?: number;
  } = {}): Observable<any> {
    return this.http.get<any>(`${this.base}/tickets`, {
      params: this.toParams({ perPage: 25, ...filters }),
    });
  }

  getMyTickets(filters: {
    status?: string;
    priority?: string;
    search?: string;
    perPage?: number;
  } = {}): Observable<any> {
    return this.http.get<any>(`${this.base}/tickets`, {
      params: this.toParams({ perPage: 25, scope: 'mine', ...filters }),
    });
  }

  getTicket(uuid: string): Observable<any> {
    return this.http.get<any>(`${this.base}/tickets/${uuid}`);
  }

  createTicket(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.base}/tickets`, data);
  }

  assignTicket(uuid: string, assigneeId: number | null, note?: string): Observable<any> {
    return this.http.post<any>(`${this.base}/tickets/${uuid}/assign`, {
      assignee_id: assigneeId,
      note,
    });
  }

  claimTicket(uuid: string): Observable<any> {
    return this.http.post<any>(`${this.base}/tickets/${uuid}/claim`, {});
  }

  updateStatus(uuid: string, status: string, priority?: string, note?: string): Observable<any> {
    return this.http.post<any>(`${this.base}/tickets/${uuid}/status`, {
      status,
      priority,
      note,
    });
  }

  setVisibility(uuid: string, isPublic: boolean, subject?: string): Observable<any> {
    return this.http.post<any>(`${this.base}/tickets/${uuid}/visibility`, {
      is_public: isPublic,
      subject,
    });
  }

  // ---- Conversation -------------------------------------------------------
  getComments(uuid: string): Observable<any> {
    return this.http.get<any>(`${this.base}/tickets/${uuid}/comments`, {
      params: this.toParams({ perPage: 50 }),
    });
  }

  postComment(uuid: string, data: { message: string; is_internal?: boolean; mentioned_user_ids?: number[] }): Observable<any> {
    return this.http.post<any>(`${this.base}/tickets/${uuid}/comments`, data);
  }

  // ---- Knowledge Posts ----------------------------------------------------
  getKnowledgePosts(filters: { search?: string; category_uuid?: string; status?: string; created_by?: string; perPage?: number; page?: number; } = {}): Observable<any> {
    return this.http.get<any>(`${this.base}/knowledge`, {
      params: this.toParams({ perPage: 25, ...filters }),
    });
  }

  getKnowledgePost(uuid: string): Observable<any> {
    return this.http.get<any>(`${this.base}/knowledge/${uuid}`);
  }

  createKnowledgePost(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.base}/knowledge`, data);
  }

  updateKnowledgePost(uuid: string, data: FormData): Observable<any> {
    data.append('_method', 'PUT');
    return this.http.post<any>(`${this.base}/knowledge/${uuid}`, data);
  }

  deleteKnowledgePost(uuid: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/knowledge/${uuid}`);
  }

  private toParams(values: Record<string, any>): HttpParams {
    let params = new HttpParams();
    for (const key of Object.keys(values)) {
      const value = values[key];
      if (value === null || value === undefined || value === '') continue;
      params = params.set(key, String(value));
    }
    return params;
  }
}
