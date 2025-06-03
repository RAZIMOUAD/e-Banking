import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface StatsResponse {
  // Basic counts
  totalUsers: number;
  totalAgents: number;
  totalClients: number;
  activeAgents: number;
  totalTransactions: number;
  totalRevenue: number;

  // Growth rates (percentage)
  userGrowthRate: number;
  transactionsGrowthRate: number;
  revenueGrowthRate: number;
  agentGrowthRate: number;

  // Time series data
  transactionsByMonth?: { [key: string]: number };
  revenueByMonth?: { [key: string]: number };
  usersByMonth?: { [key: string]: number };

  // Distribution data
  currencyDistribution?: { [key: string]: number };
  transactionTypeDistribution?: { [key: string]: number };
  agentPerformance?: { [key: string]: number };

  // Recent activity
  recentTransactions?: Array<{
    id: number;
    type: string;
    amount: number;
    currency: string;
    date: Date;
    status: string;
    clientName?: string;
    agentName?: string;
  }>;

  recentAgentActivity?: Array<{
    id: number;
    name: string;
    action: string;
    date: Date;
    details?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly apiUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}/stats`)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  getStatsByPeriod(period: string): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}/stats`, {
      params: { period }
    })
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  getDashboardMetrics(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}/dashboard/metrics`)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<StatsResponse> {
    console.error('Stats Service Error:', error);

    // Return mock data for development/fallback
    if (error.status === 0 || error.status >= 500) {
      console.warn('Backend unavailable, returning mock stats data');
      return of(this.getMockStats());
    }

    return throwError(() => error);
  }

  // Comprehensive mock data for dashboard
  private getMockStats(): StatsResponse {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    return {
      // Basic counts
      totalUsers: 12486,
      totalAgents: 45,
      totalClients: 12441,
      activeAgents: 38,
      totalTransactions: 8745,
      totalRevenue: 543627.89,

      // Growth rates (percentage changes from previous period)
      userGrowthRate: 12.5,
      transactionsGrowthRate: 8.3,
      revenueGrowthRate: -2.7,
      agentGrowthRate: 5.4,

      // Monthly transaction data
      transactionsByMonth: {
        'Jan': 1200,
        'Feb': 1450,
        'Mar': 1680,
        'Apr': 1520,
        'May': 1890,
        'Jun': 2100,
        'Jul': 1970,
        'Aug': 2250,
        'Sep': 2180,
        'Oct': 2340,
        'Nov': 2480,
        'Dec': 2650
      },

      // Monthly revenue data
      revenueByMonth: {
        'Jan': 45200,
        'Feb': 48300,
        'Mar': 52100,
        'Apr': 47800,
        'May': 54600,
        'Jun': 58900,
        'Jul': 56200,
        'Aug': 61400,
        'Sep': 59700,
        'Oct': 63800,
        'Nov': 67200,
        'Dec': 71500
      },

      // Monthly users data
      usersByMonth: {
        'Jan': 9200,
        'Feb': 9650,
        'Mar': 10100,
        'Apr': 10450,
        'May': 10800,
        'Jun': 11200,
        'Jul': 11550,
        'Aug': 11900,
        'Sep': 12150,
        'Oct': 12350,
        'Nov': 12400,
        'Dec': 12486
      },

      // Currency distribution (percentage)
      currencyDistribution: {
        'MAD': 65,
        'EUR': 20,
        'USD': 12,
        'GBP': 2,
        'Other': 1
      },

      // Transaction type distribution
      transactionTypeDistribution: {
        'Transfer': 45,
        'Deposit': 30,
        'Withdrawal': 20,
        'Payment': 5
      },

      // Agent performance (transactions handled)
      agentPerformance: {
        'Ahmed Alami': 156,
        'Fatima Bennani': 142,
        'Omar Chakir': 98,
        'Khadija Douiri': 134,
        'Youssef El Fassi': 87
      },

      // Recent transactions
      recentTransactions: [
        {
          id: 8745,
          type: 'Transfer',
          amount: 2500,
          currency: 'MAD',
          date: new Date(),
          status: 'Completed',
          clientName: 'Hassan Benali',
          agentName: 'Ahmed Alami'
        },
        {
          id: 8744,
          type: 'Deposit',
          amount: 15000,
          currency: 'MAD',
          date: new Date(Date.now() - 1800000), // 30 minutes ago
          status: 'Completed',
          clientName: 'Aicha Tazi',
          agentName: 'Fatima Bennani'
        },
        {
          id: 8743,
          type: 'Withdrawal',
          amount: 800,
          currency: 'EUR',
          date: new Date(Date.now() - 3600000), // 1 hour ago
          status: 'Pending',
          clientName: 'Mohamed Idrissi',
          agentName: 'Omar Chakir'
        },
        {
          id: 8742,
          type: 'Transfer',
          amount: 5000,
          currency: 'MAD',
          date: new Date(Date.now() - 7200000), // 2 hours ago
          status: 'Completed',
          clientName: 'Zahra Fassi',
          agentName: 'Khadija Douiri'
        },
        {
          id: 8741,
          type: 'Payment',
          amount: 320,
          currency: 'USD',
          date: new Date(Date.now() - 10800000), // 3 hours ago
          status: 'Failed',
          clientName: 'Khalid Benjelloun',
          agentName: 'Youssef El Fassi'
        }
      ],

      // Recent agent activity
      recentAgentActivity: [
        {
          id: 1,
          name: 'Ahmed Alami',
          action: 'Processed large transfer for premium client',
          date: new Date(),
          details: 'Transfer of 50,000 MAD approved after verification'
        },
        {
          id: 2,
          name: 'Fatima Bennani',
          action: 'Resolved client account issue',
          date: new Date(Date.now() - 1800000),
          details: 'Unlocked account after identity verification'
        },
        {
          id: 3,
          name: 'Khadija Douiri',
          action: 'Updated client KYC documents',
          date: new Date(Date.now() - 3600000),
          details: 'Processed new identity documents for compliance'
        },
        {
          id: 4,
          name: 'Omar Chakir',
          action: 'Flagged suspicious transaction',
          date: new Date(Date.now() - 5400000),
          details: 'Transaction blocked pending investigation'
        },
        {
          id: 5,
          name: 'Youssef El Fassi',
          action: 'Completed monthly report',
          date: new Date(Date.now() - 7200000),
          details: 'Generated and submitted client portfolio analysis'
        }
      ]
    };
  }
}
