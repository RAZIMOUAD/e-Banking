import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AgentRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export interface AgentResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private baseUrl = '/api/v1/admin/agents';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AgentResponse[]> {
    return this.http.get<AgentResponse[]>(this.baseUrl);
  }

  create(agent: AgentRequest): Observable<AgentResponse> {
    return this.http.post<AgentResponse>(this.baseUrl, agent);
  }

  update(id: number, agent: AgentRequest): Observable<AgentResponse> {
    return this.http.put<AgentResponse>(`${this.baseUrl}/${id}`, agent);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
