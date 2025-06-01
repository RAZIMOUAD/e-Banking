import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaces basées sur les DTO du backend
export interface DeviseRequest {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  active: boolean;
}

export interface DeviseResponse {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  active: boolean;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DeviseService {
  private apiUrl = `${environment.apiBaseUrl}/admin/devises`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les devises
   */
  findAll(): Observable<DeviseResponse[]> {
    return this.http.get<DeviseResponse[]>(this.apiUrl);
  }

  /**
   * Récupère une devise par son ID
   */
  findById(id: number): Observable<DeviseResponse> {
    return this.http.get<DeviseResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée une nouvelle devise
   */
  create(request: DeviseRequest): Observable<DeviseResponse> {
    return this.http.post<DeviseResponse>(this.apiUrl, request);
  }

  /**
   * Met à jour une devise existante
   */
  update(id: number, request: DeviseRequest): Observable<DeviseResponse> {
    return this.http.put<DeviseResponse>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Supprime une devise
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualise les taux de change (cette méthode pourrait être implémentée côté backend)
   */
  refreshRates(): Observable<DeviseResponse[]> {
    return this.http.post<DeviseResponse[]>(`${this.apiUrl}/refresh-rates`, {});
  }
}
