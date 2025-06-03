import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface GlobalSettingsRequest {
  // System Settings
  defaultCurrency?: string;
  transactionFeePercentage?: number;
  minimumTransactionFee?: number;
  maximumTransactionFee?: number;
  dailyTransactionLimit?: number;
  maintenanceMode?: boolean;
  supportEmail?: string;
  supportPhone?: string;
  termsLastUpdated?: Date;

  // Security Settings
  passwordExpiryDays?: number;
  maxLoginAttempts?: number;
  lockoutDurationMinutes?: number;
  requireTwoFactor?: boolean;
  sessionTimeoutMinutes?: number;
  allowedIpAddresses?: string;

  // Notification Settings
  enableEmailNotifications?: boolean;
  enableSmsNotifications?: boolean;
  enablePushNotifications?: boolean;
  transactionNotifications?: boolean;
  loginNotifications?: boolean;
  marketingNotifications?: boolean;
  systemNotifications?: boolean;
}

export interface GlobalSettingsResponse extends GlobalSettingsRequest {
  id: number;
  lastUpdated: Date;
  updatedBy?: string;
  version?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/settings`;

  // Cache des paramètres actuels
  private settingsSubject = new BehaviorSubject<GlobalSettingsResponse | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Charger les paramètres au démarrage
    this.loadSettings();
  }

  getSettings(): Observable<GlobalSettingsResponse> {
    return this.http.get<GlobalSettingsResponse>(this.apiUrl)
      .pipe(
        retry(2),
        tap(settings => this.settingsSubject.next(settings)),
        catchError(this.handleError.bind(this))
      );
  }

  updateSettings(settings: GlobalSettingsRequest): Observable<GlobalSettingsResponse> {
    return this.http.put<GlobalSettingsResponse>(this.apiUrl, settings)
      .pipe(
        tap(updatedSettings => this.settingsSubject.next(updatedSettings)),
        catchError(this.handleError.bind(this))
      );
  }

  // Méthodes spécifiques pour différents types de paramètres
  updateSystemSettings(settings: Partial<GlobalSettingsRequest>): Observable<GlobalSettingsResponse> {
    return this.updateSettings(settings);
  }

  updateSecuritySettings(settings: Partial<GlobalSettingsRequest>): Observable<GlobalSettingsResponse> {
    return this.updateSettings(settings);
  }

  updateNotificationSettings(settings: Partial<GlobalSettingsRequest>): Observable<GlobalSettingsResponse> {
    return this.updateSettings(settings);
  }

  // Toggle maintenance mode
  toggleMaintenanceMode(enabled: boolean): Observable<GlobalSettingsResponse> {
    return this.updateSettings({ maintenanceMode: enabled });
  }

  // Reset to default settings
  resetToDefaults(): Observable<GlobalSettingsResponse> {
    return this.http.post<GlobalSettingsResponse>(`${this.apiUrl}/reset`, {})
      .pipe(
        tap(settings => this.settingsSubject.next(settings)),
        catchError(this.handleError.bind(this))
      );
  }

  // Get settings history/audit trail
  getSettingsHistory(limit: number = 50): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`, {
      params: { limit: limit.toString() }
    })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Export settings as JSON
  exportSettings(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob'
    })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Import settings from JSON
  importSettings(file: File): Observable<GlobalSettingsResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<GlobalSettingsResponse>(`${this.apiUrl}/import`, formData)
      .pipe(
        tap(settings => this.settingsSubject.next(settings)),
        catchError(this.handleError.bind(this))
      );
  }

  // Validate settings before applying
  validateSettings(settings: GlobalSettingsRequest): Observable<{ valid: boolean; errors: string[] }> {
    return this.http.post<{ valid: boolean; errors: string[] }>(`${this.apiUrl}/validate`, settings)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Get current cached settings
  getCurrentSettings(): GlobalSettingsResponse | null {
    return this.settingsSubject.value;
  }

  // Load settings into cache
  private loadSettings(): void {
    this.getSettings().subscribe({
      next: (settings) => {
        console.log('Settings loaded successfully');
      },
      error: (error) => {
        console.warn('Failed to load settings, using defaults');
      }
    });
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('Settings Service Error:', error);

    // Return mock data for development/fallback
    if (error.status === 0 || error.status >= 500) {
      console.warn('Backend unavailable, returning mock settings data');
      return of(this.getMockSettings());
    }

    return throwError(() => error);
  }

  // Comprehensive mock settings data
  private getMockSettings(): GlobalSettingsResponse {
    return {
      id: 1,

      // System Settings
      defaultCurrency: 'MAD',
      transactionFeePercentage: 1.5,
      minimumTransactionFee: 5.0,
      maximumTransactionFee: 500.0,
      dailyTransactionLimit: 50000.0,
      maintenanceMode: false,
      supportEmail: 'support@ebanking.ma',
      supportPhone: '+212 5XX-XXXXXX',
      termsLastUpdated: new Date('2024-01-01'),

      // Security Settings
      passwordExpiryDays: 90,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 30,
      requireTwoFactor: true,
      sessionTimeoutMinutes: 30,
      allowedIpAddresses: '', // Empty = allow all

      // Notification Settings
      enableEmailNotifications: true,
      enableSmsNotifications: true,
      enablePushNotifications: true,
      transactionNotifications: true,
      loginNotifications: true,
      marketingNotifications: false,
      systemNotifications: true,

      // Metadata
      lastUpdated: new Date(),
      updatedBy: 'System',
      version: 1
    };
  }
}
