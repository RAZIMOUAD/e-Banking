import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaces basées sur les DTO du backend
export interface GlobalSettingsRequest {
  defaultCurrency: string;
  transactionFeePercentage: number;
  minimumTransactionFee: number;
  maximumTransactionFee: number;
  dailyTransactionLimit: number;
  maintenanceMode: boolean;
  supportEmail: string;
  supportPhone: string;
  termsLastUpdated: Date;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  requireTwoFactor: boolean;
  sessionTimeoutMinutes: number;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  enablePushNotifications: boolean;
}

export interface GlobalSettingsResponse {
  id: number;
  defaultCurrency: string;
  transactionFeePercentage: number;
  minimumTransactionFee: number;
  maximumTransactionFee: number;
  dailyTransactionLimit: number;
  maintenanceMode: boolean;
  supportEmail: string;
  supportPhone: string;
  termsLastUpdated: Date;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  requireTwoFactor: boolean;
  sessionTimeoutMinutes: number;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  enablePushNotifications: boolean;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiBaseUrl}/admin/settings`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère les paramètres globaux
   */
  getSettings(): Observable<GlobalSettingsResponse> {
    return this.http.get<GlobalSettingsResponse>(this.apiUrl);
  }

  /**
   * Met à jour les paramètres globaux
   */
  updateSettings(request: GlobalSettingsRequest): Observable<GlobalSettingsResponse> {
    return this.http.put<GlobalSettingsResponse>(this.apiUrl, request);
  }
}
