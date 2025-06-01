import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interface basée sur le DTO du backend
export interface StatsResponse {
  totalUsers: number;
  totalAgents: number;
  activeAgents: number;
  totalTransactions: number;
  totalRevenue: number;
  userGrowthRate: number;
  transactionsGrowthRate: number;
  revenueGrowthRate: number;
  agentGrowthRate: number;
  // Changer de Map à Record<string, number>
  transactionsByMonth: Record<string, number>;
  currencyDistribution: Record<string, number>;
  recentTransactions: any[];
  recentAgentActivity: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = `${environment.apiBaseUrl}/admin/stats`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère les statistiques
   */
  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(this.apiUrl);
  }

  /**
   * Récupère les statistiques pour une période spécifique
   */
  getStatsByPeriod(period: string): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}?period=${period}`);
  }

  /**
   * Récupère les statistiques pour une plage de dates spécifique
   */
  getStatsByDateRange(startDate: string, endDate: string): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}?startDate=${startDate}&endDate=${endDate}`);
  }
}
