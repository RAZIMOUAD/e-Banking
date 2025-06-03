// Agent Service Interface - src/app/core/services/agent.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Backend response interface matching your actual Java entity
export interface AgentBackendResponse {
  id?: number;
  nom: string;
  prenom: string;
  email?: string;
  numTel: string;
  service: string;
  matricule: string;
  dateEmbauche: number; // timestamp
}

// Frontend interface for easier display
export interface AgentResponse {
  id?: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  registrationDate?: Date;
  lastActive?: Date;
  transactionsCount?: number;
  service?: string;
  matricule?: string;
}

// Request interface for creating/updating agents
export interface AgentRequest {
  nom: string;
  prenom: string;
  email?: string;
  numTel: string;
  service?: string;
  matricule?: string;
  dateEmbauche?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = `${environment.apiBaseUrl}/admin/agents`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<AgentResponse[]> {
    return this.http.get<AgentBackendResponse[]>(this.apiUrl).pipe(
      map(backendAgents => backendAgents.map(this.transformBackendToFrontend))
    );
  }

  findById(id: number): Observable<AgentResponse> {
    return this.http.get<AgentBackendResponse>(`${this.apiUrl}/${id}`).pipe(
      map(this.transformBackendToFrontend)
    );
  }

  create(agent: AgentRequest): Observable<AgentResponse> {
    return this.http.post<AgentBackendResponse>(this.apiUrl, agent).pipe(
      map(this.transformBackendToFrontend)
    );
  }

  update(id: number, agent: AgentRequest): Observable<AgentResponse> {
    return this.http.put<AgentBackendResponse>(`${this.apiUrl}/${id}`, agent).pipe(
      map(this.transformBackendToFrontend)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Transform backend response to frontend format
  private transformBackendToFrontend(backendAgent: AgentBackendResponse): AgentResponse {
    return {
      id: backendAgent.id,
      name: `${backendAgent.prenom || ''} ${backendAgent.nom || ''}`.trim() || 'N/A',
      email: backendAgent.email || 'N/A',
      phone: backendAgent.numTel || 'N/A',
      status: 'Active', // Default status since not provided by backend
      registrationDate: backendAgent.dateEmbauche ? new Date(backendAgent.dateEmbauche) : undefined,
      lastActive: new Date(), // Default to current date
      transactionsCount: Math.floor(Math.random() * 200), // Random for demo
      service: backendAgent.service,
      matricule: backendAgent.matricule
    };
  }

  // Transform frontend request to backend format
  transformFrontendToBackend(frontendAgent: Partial<AgentResponse>): AgentRequest {
    const nameParts = (frontendAgent.name || '').split(' ');
    return {
      nom: nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] || '',
      prenom: nameParts.length > 1 ? nameParts[0] : '',
      email: frontendAgent.email,
      numTel: frontendAgent.phone || '',
      service: frontendAgent.service,
      matricule: frontendAgent.matricule
    };
  }
}
