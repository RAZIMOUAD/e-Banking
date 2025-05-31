import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GlobalSettingsRequest {
  tauxInteret: number;
  fraisTransaction: number;
  plafondVirement: number;
}

export interface GlobalSettingsResponse extends GlobalSettingsRequest {}

@Injectable({ providedIn: 'root' })
export class GlobalSettingsService {
  private url = '/api/v1/admin/settings';

  constructor(private http: HttpClient) {}

  get(): Observable<GlobalSettingsResponse> {
    return this.http.get<GlobalSettingsResponse>(this.url);
  }

  update(data: GlobalSettingsRequest): Observable<GlobalSettingsResponse> {
    return this.http.put<GlobalSettingsResponse>(this.url, data);
  }
}
