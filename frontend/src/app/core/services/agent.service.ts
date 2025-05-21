import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// Interfaces basées sur les DTO du backend
export interface AgentRequest {
  name: string;
  email: string;
  phone: string;
  status: string;
}

export interface AgentResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  registrationDate: Date;
  lastActive: Date;
  transactionsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = `${environment.apiBaseUrl}/api/v1/admin/agents`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les agents
   */
  findAll(): Observable<AgentResponse[]> {
    return this.http.get<AgentResponse[]>(this.apiUrl);
  }

  /**
   * Récupère un agent par son ID
   */
  findById(id: number): Observable<AgentResponse> {
    return this.http.get<AgentResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouvel agent
   */
  create(request: AgentRequest): Observable<AgentResponse> {
    return this.http.post<AgentResponse>(this.apiUrl, request);
  }

  /**
   * Met à jour un agent existant
   */
  update(id: number, request: AgentRequest): Observable<AgentResponse> {
    return this.http.put<AgentResponse>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Supprime un agent
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
