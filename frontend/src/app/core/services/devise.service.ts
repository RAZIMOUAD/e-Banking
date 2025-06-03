import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DeviseRequest {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  active?: boolean;
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
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/devises`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<DeviseResponse[]> {
    return this.http.get<DeviseResponse[]>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  findById(id: number): Observable<DeviseResponse> {
    return this.http.get<DeviseResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  create(devise: DeviseRequest): Observable<DeviseResponse> {
    return this.http.post<DeviseResponse>(this.apiUrl, devise)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  update(id: number, devise: DeviseRequest): Observable<DeviseResponse> {
    return this.http.put<DeviseResponse>(`${this.apiUrl}/${id}`, devise)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Refresh exchange rates from external API
  refreshRates(): Observable<DeviseResponse[]> {
    return this.http.post<DeviseResponse[]>(`${this.apiUrl}/refresh-rates`, {})
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Get exchange rate history
  getExchangeRateHistory(deviseId: number, days: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${deviseId}/history`, {
      params: { days: days.toString() }
    })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('Devise Service Error:', error);

    // Return mock data for development/fallback
    if (error.status === 0 || error.status >= 500) {
      console.warn('Backend unavailable, returning mock devise data');
      return of(this.getMockDevises());
    }

    return throwError(() => error);
  }

  // Comprehensive mock data for currencies
  private getMockDevises(): DeviseResponse[] {
    const now = new Date();

    return [
      {
        id: 1,
        code: 'MAD',
        name: 'Moroccan Dirham',
        symbol: 'MAD',
        exchangeRate: 1.0, // Base currency
        active: true,
        lastUpdated: now
      },
      {
        id: 2,
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        exchangeRate: 0.1, // 1 MAD = 0.1 USD
        active: true,
        lastUpdated: new Date(now.getTime() - 3600000) // 1 hour ago
      },
      {
        id: 3,
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        exchangeRate: 0.092, // 1 MAD = 0.092 EUR
        active: true,
        lastUpdated: new Date(now.getTime() - 3600000 * 2) // 2 hours ago
      },
      {
        id: 4,
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        exchangeRate: 0.078, // 1 MAD = 0.078 GBP
        active: true,
        lastUpdated: new Date(now.getTime() - 3600000 * 3) // 3 hours ago
      },
      {
        id: 5,
        code: 'JPY',
        name: 'Japanese Yen',
        symbol: '¥',
        exchangeRate: 14.53, // 1 MAD = 14.53 JPY
        active: true,
        lastUpdated: new Date(now.getTime() - 3600000 * 4) // 4 hours ago
      },
      {
        id: 6,
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
        exchangeRate: 0.135, // 1 MAD = 0.135 CAD
        active: false,
        lastUpdated: new Date(now.getTime() - 3600000 * 24) // 1 day ago
      },
      {
        id: 7,
        code: 'AUD',
        name: 'Australian Dollar',
        symbol: 'A$',
        exchangeRate: 0.145, // 1 MAD = 0.145 AUD
        active: true,
        lastUpdated: new Date(now.getTime() - 3600000 * 5) // 5 hours ago
      },
      {
        id: 8,
        code: 'CHF',
        name: 'Swiss Franc',
        symbol: 'CHF',
        exchangeRate: 0.089, // 1 MAD = 0.089 CHF
        active: true,
        lastUpdated: new Date(now.getTime() - 3600000 * 6) // 6 hours ago
      },
      {
        id: 9,
        code: 'CNY',
        name: 'Chinese Yuan',
        symbol: '¥',
        exchangeRate: 0.71, // 1 MAD = 0.71 CNY
        active: true,
        lastUpdated: new Date(now.getTime() - 3600000 * 7) // 7 hours ago
      },
      {
        id: 10,
        code: 'SAR',
        name: 'Saudi Riyal',
        symbol: 'ر.س',
        exchangeRate: 0.375, // 1 MAD = 0.375 SAR
        active: true,
        lastUpdated: new Date(now.getTime() - 3600000 * 8) // 8 hours ago
      }
    ];
  }
}
