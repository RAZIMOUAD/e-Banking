import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuditLog {
  id: number;
  action: string;
  entity: string;
  entityId: number;
  userId: number;
  userName: string;
  userRole: string;
  timestamp: Date;
  details: string;
  ipAddress: string;
  status: string;
  sessionId?: string;
  userAgent?: string;
  location?: string;
}

export interface AuditFilter {
  action?: string;
  entity?: string;
  userId?: number;
  userRole?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/audit`;

  constructor(private http: HttpClient) {}

  getAuditLogs(filter?: AuditFilter): Observable<AuditLog[]> {
    let params: any = {};

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== null && value !== undefined) {
          params[key] = value;
        }
      });
    }

    return this.http.get<AuditLog[]>(this.apiUrl, { params })
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  getAuditLogById(id: number): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  exportAuditLogs(filter?: AuditFilter): Observable<Blob> {
    let params: any = {};

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== null && value !== undefined) {
          params[key] = value;
        }
      });
    }

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getAvailableActions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/actions`)
      .pipe(
        catchError(() => of(this.getMockActions()))
      );
  }

  getAvailableEntities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/entities`)
      .pipe(
        catchError(() => of(this.getMockEntities()))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('Audit Service Error:', error);

    // Return mock data for development/fallback
    if (error.status === 0 || error.status >= 500) {
      console.warn('Backend unavailable, returning mock audit data');
      return of(this.getMockAuditLogs());
    }

    return throwError(() => error);
  }

  private getMockActions(): string[] {
    return ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'TRANSFER', 'DEPOSIT', 'WITHDRAWAL'];
  }

  private getMockEntities(): string[] {
    return ['USER', 'AGENT', 'CLIENT', 'ACCOUNT', 'TRANSACTION', 'DEVISE', 'SYSTEM'];
  }

  // Comprehensive mock audit data
  private getMockAuditLogs(): AuditLog[] {
    const now = new Date();

    return [
      {
        id: 1,
        action: 'CREATE',
        entity: 'AGENT',
        entityId: 15,
        userId: 1,
        userName: 'Admin User',
        userRole: 'ADMIN',
        timestamp: new Date(now.getTime() - 300000), // 5 minutes ago
        details: 'Created new agent account for Ahmed Alami with matricule AGT015',
        ipAddress: '192.168.1.105',
        status: 'SUCCESS',
        sessionId: 'sess_admin_001',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Casablanca, Morocco'
      },
      {
        id: 2,
        action: 'LOGIN',
        entity: 'USER',
        entityId: 1,
        userId: 1,
        userName: 'Admin User',
        userRole: 'ADMIN',
        timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
        details: 'Administrator successfully logged in from web dashboard',
        ipAddress: '192.168.1.105',
        status: 'SUCCESS',
        sessionId: 'sess_admin_001',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Casablanca, Morocco'
      },
      {
        id: 3,
        action: 'UPDATE',
        entity: 'DEVISE',
        entityId: 2,
        userId: 1,
        userName: 'Admin User',
        userRole: 'ADMIN',
        timestamp: new Date(now.getTime() - 7200000), // 2 hours ago
        details: 'Updated EUR exchange rate from 10.92 to 10.89 MAD per EUR',
        ipAddress: '192.168.1.105',
        status: 'SUCCESS',
        sessionId: 'sess_admin_001',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Casablanca, Morocco'
      },
      {
        id: 4,
        action: 'TRANSFER',
        entity: 'TRANSACTION',
        entityId: 8745,
        userId: 5,
        userName: 'Ahmed Alami',
        userRole: 'AGENT',
        timestamp: new Date(now.getTime() - 1800000), // 30 minutes ago
        details: 'Processed transfer of 2,500 MAD from account 12345 to account 67890 for client Hassan Benali',
        ipAddress: '192.168.1.110',
        status: 'SUCCESS',
        sessionId: 'sess_agent_005',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Rabat, Morocco'
      },
      {
        id: 5,
        action: 'LOGIN',
        entity: 'USER',
        entityId: 12,
        userId: 12,
        userName: 'Hassan Benali',
        userRole: 'CLIENT',
        timestamp: new Date(now.getTime() - 900000), // 15 minutes ago
        details: 'Client logged in via mobile application',
        ipAddress: '41.82.142.15',
        status: 'SUCCESS',
        sessionId: 'sess_client_012',
        userAgent: 'EBankingApp/1.2.0 (Android 13; SM-G998B)',
        location: 'Marrakech, Morocco'
      },

      {
        id: 7,
        action: 'DELETE',
        entity: 'AGENT',
        entityId: 12,
        userId: 1,
        userName: 'Admin User',
        userRole: 'ADMIN',
        timestamp: new Date(now.getTime() - 86400000), // 1 day ago
        details: 'Deleted inactive agent account (matricule: AGT012) after 90 days of inactivity',
        ipAddress: '192.168.1.105',
        status: 'SUCCESS',
        sessionId: 'sess_admin_001',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Casablanca, Morocco'
      },
      {
        id: 8,
        action: 'WITHDRAWAL',
        entity: 'TRANSACTION',
        entityId: 8743,
        userId: 6,
        userName: 'Fatima Bennani',
        userRole: 'AGENT',
        timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
        details: 'Processed withdrawal of 800 EUR from account 23456 for client Mohamed Idrissi',
        ipAddress: '192.168.1.111',
        status: 'PENDING',
        sessionId: 'sess_agent_006',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Rabat, Morocco'
      },
      {
        id: 9,
        action: 'UPDATE',
        entity: 'CLIENT',
        entityId: 145,
        userId: 7,
        userName: 'Omar Chakir',
        userRole: 'AGENT',
        timestamp: new Date(now.getTime() - 10800000), // 3 hours ago
        details: 'Updated client KYC documents and verified identity for Zahra Fassi',
        ipAddress: '192.168.1.112',
        status: 'SUCCESS',
        sessionId: 'sess_agent_007',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Fes, Morocco'
      },
      {
        id: 10,
        action: 'CREATE',
        entity: 'TRANSACTION',
        entityId: 8741,
        userId: 8,
        userName: 'Khadija Douiri',
        userRole: 'AGENT',
        timestamp: new Date(now.getTime() - 14400000), // 4 hours ago
        details: 'Flagged suspicious payment attempt of 50,000 MAD - transaction blocked for investigation',
        ipAddress: '192.168.1.113',
        status: 'BLOCKED',
        sessionId: 'sess_agent_008',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Meknes, Morocco'
      },
      {
        id: 11,
        action: 'READ',
        entity: 'ACCOUNT',
        entityId: 12345,
        userId: 12,
        userName: 'Hassan Benali',
        userRole: 'CLIENT',
        timestamp: new Date(now.getTime() - 600000), // 10 minutes ago
        details: 'Client viewed account balance and transaction history',
        ipAddress: '41.82.142.15',
        status: 'SUCCESS',
        sessionId: 'sess_client_012',
        userAgent: 'EBankingApp/1.2.0 (Android 13; SM-G998B)',
        location: 'Marrakech, Morocco'
      },
      {
        id: 12,
        action: 'UPDATE',
        entity: 'SYSTEM',
        entityId: 1,
        userId: 1,
        userName: 'Admin User',
        userRole: 'ADMIN',
        timestamp: new Date(now.getTime() - 172800000), // 2 days ago
        details: 'Updated system maintenance window schedule for weekend deployment',
        ipAddress: '192.168.1.105',
        status: 'SUCCESS',
        sessionId: 'sess_admin_001',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Casablanca, Morocco'
      }
    ];
  }
}
