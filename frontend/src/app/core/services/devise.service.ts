// Complete Devise Service - src/app/core/services/devise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Backend response interface matching your actual XML/JSON structure
export interface DeviseResponse {
  id: number;
  code: string;
  libelle: string;
  tauxConversion: number;
}

// Request interface for creating/updating currencies
export interface DeviseRequest {
  code: string;
  libelle: string;
  tauxConversion: number;
}

// Additional interfaces for better type safety
export interface DeviseStatistics {
  totalCurrencies: number;
  activeCurrencies: number;
  baseCurrency: string;
  lastUpdate: Date;
}

export interface ExchangeRateUpdate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DeviseService {
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/devises`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Get all currencies
   */
  findAll(): Observable<DeviseResponse[]> {
    return this.http.get<DeviseResponse[]>(this.apiUrl, this.httpOptions)
      .pipe(
        map(devises => devises || []),
        catchError(this.handleError)
      );
  }

  /**
   * Get currency by ID
   */
  findById(id: number): Observable<DeviseResponse> {
    return this.http.get<DeviseResponse>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create new currency
   */
  save(devise: DeviseRequest): Observable<DeviseResponse> {
    return this.http.post<DeviseResponse>(this.apiUrl, devise, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update existing currency
   */
  update(id: number, devise: DeviseRequest): Observable<DeviseResponse> {
    return this.http.put<DeviseResponse>(`${this.apiUrl}/${id}`, devise, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete currency
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get currency statistics
   */
  getStatistics(): Observable<DeviseStatistics> {
    return this.findAll().pipe(
      map(devises => ({
        totalCurrencies: devises.length,
        activeCurrencies: devises.length, // All loaded currencies are active
        baseCurrency: 'MAD', // Based on your data showing MAD as base (rate 1.0)
        lastUpdate: new Date()
      }))
    );
  }

  /**
   * Convert amount from one currency to another
   */
  convertCurrency(amount: number, fromCode: string, toCode: string): Observable<number> {
    return this.findAll().pipe(
      map(devises => {
        const fromCurrency = devises.find(d => d.code === fromCode);
        const toCurrency = devises.find(d => d.code === toCode);

        if (!fromCurrency || !toCurrency) {
          throw new Error(`Currency not found: ${fromCode} or ${toCode}`);
        }

        // Convert through base currency (MAD)
        const amountInMAD = amount / fromCurrency.tauxConversion;
        return amountInMAD * toCurrency.tauxConversion;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get exchange rate between two currencies
   */
  getExchangeRate(fromCode: string, toCode: string): Observable<number> {
    return this.convertCurrency(1, fromCode, toCode);
  }

  /**
   * Simulate rate refresh (since your backend might not have this endpoint)
   */
  refreshRates(): Observable<DeviseResponse[]> {
    return this.findAll().pipe(
      map(devises => devises.map(devise => ({
        ...devise,
        tauxConversion: this.simulateRateFluctuation(devise.tauxConversion, devise.code)
      })))
    );
  }

  /**
   * Validate currency data
   */
  validateDevise(devise: DeviseRequest): string[] {
    const errors: string[] = [];

    if (!devise.code || devise.code.trim().length !== 3) {
      errors.push('Currency code must be exactly 3 characters');
    }

    if (!devise.libelle || devise.libelle.trim().length < 2) {
      errors.push('Currency name must be at least 2 characters');
    }

    if (!devise.tauxConversion || devise.tauxConversion <= 0) {
      errors.push('Exchange rate must be greater than 0');
    }

    if (devise.tauxConversion && devise.tauxConversion > 10000) {
      errors.push('Exchange rate seems too high (max: 10,000)');
    }

    return errors;
  }

  /**
   * Check if currency code already exists
   */
  checkCodeExists(code: string, excludeId?: number): Observable<boolean> {
    return this.findAll().pipe(
      map(devises => devises.some(d =>
        d.code.toUpperCase() === code.toUpperCase() &&
        (!excludeId || d.id !== excludeId)
      ))
    );
  }

  /**
   * Get popular currencies for quick selection
   */
  getPopularCurrencies(): string[] {
    return ['USD', 'EUR', 'MAD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];
  }

  /**
   * Format currency amount with proper symbol and decimals
   */
  formatAmount(amount: number, currencyCode: string): string {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'MAD': 'DH',
      'GBP': '£',
      'JPY': '¥',
      'CHF': 'CHF',
      'CAD': 'C$',
      'AUD': 'A$'
    };

    const symbol = symbols[currencyCode] || currencyCode;
    const decimals = currencyCode === 'JPY' ? 0 : 2;

    return `${amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })} ${symbol}`;
  }

  /**
   * Private helper methods
   */
  private simulateRateFluctuation(currentRate: number, code: string): number {
    // Don't change base currency rate
    if (code === 'MAD') return currentRate;

    // Apply small random fluctuation (±2%)
    const fluctuation = (Math.random() - 0.5) * 0.04;
    const newRate = currentRate * (1 + fluctuation);

    // Round to 4 decimal places
    return Math.round(newRate * 10000) / 10000;
  }

  private handleError(error: any): Observable<never> {
    console.error('DeviseService error:', error);

    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request data';
          break;
        case 404:
          errorMessage = 'Currency not found';
          break;
        case 409:
          errorMessage = 'Currency code already exists';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
        default:
          errorMessage = `Error: ${error.status} - ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
