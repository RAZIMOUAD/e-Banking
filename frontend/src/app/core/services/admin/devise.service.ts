import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DeviseRequest {
  code: string;
  label: string;
  taux: number;
  active: boolean;
}

export interface DeviseResponse {
  id: number;
  code: string;
  label: string;
  taux: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class DeviseService {
  private baseUrl = '/api/v1/admin/devises';

  constructor(private http: HttpClient) {}

  findAll(): Observable<DeviseResponse[]> {
    return this.http.get<DeviseResponse[]>(this.baseUrl);
  }

  save(devise: DeviseRequest): Observable<DeviseResponse> {
    return this.http.post<DeviseResponse>(this.baseUrl, devise);
  }

  update(id: number, devise: DeviseRequest): Observable<DeviseResponse> {
    return this.http.put<DeviseResponse>(`${this.baseUrl}/${id}`, devise);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
