import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { StatsService, StatsResponse } from '@core/services/stats.service';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { of, Subject, interval } from 'rxjs';

interface Metric {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: string;
  class: string;
  prefix?: string;
  suffix?: string;
  formatValue?: (value: number) => string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgChartsModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userName = 'Admin';
  selectedDateRange = 'month';
  lastUpdated = new Date();

  // Loading states
  loading = false;
  error = false;
  refreshing = false;

  // Key metrics data
  keyMetrics: Metric[] = [];

  // Chart configurations
  transactionsChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  revenueChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  currencyChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  transactionTypeChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  // Chart options
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3b82f6',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  // Recent activity data
  recentTransactions: any[] = [];
  recentAgentActivity: any[] = [];

  // Table columns
  transactionColumns: string[] = ['id', 'type', 'amount', 'date', 'status', 'client'];
  agentColumns: string[] = ['agent', 'action', 'date', 'details'];

  constructor(
    private statsService: StatsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();

    // Auto-refresh every 5 minutes
    interval(300000) // 5 minutes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TrackBy function for ngFor optimization
  trackMetric(index: number, metric: Metric): string {
    return metric.id;
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = false;

    this.statsService.getStatsByPeriod(this.selectedDateRange)
      .pipe(
        catchError(error => {
          console.error('Error loading dashboard data:', error);
          this.error = true;
          this.snackBar.open('Using offline data - backend unavailable', 'Close', {
            duration: 3000
          });
          return of(this.getMockStats());
        }),
        finalize(() => {
          this.loading = false;
          this.lastUpdated = new Date();
        })
      )
      .subscribe((stats: StatsResponse) => {
        this.updateDashboardData(stats);
      });
  }

  refreshData(): void {
    this.refreshing = true;

    this.statsService.getStatsByPeriod(this.selectedDateRange)
      .pipe(
        catchError(error => {
          console.error('Error refreshing data:', error);
          return of(this.getMockStats());
        }),
        finalize(() => {
          this.refreshing = false;
          this.lastUpdated = new Date();
        })
      )
      .subscribe((stats: StatsResponse) => {
        this.updateDashboardData(stats);
      });
  }

  updateDashboardData(stats: StatsResponse): void {
    // Update key metrics
    this.keyMetrics = [
      {
        id: 'users',
        title: 'Total Users',
        value: stats.totalUsers,
        change: stats.userGrowthRate,
        icon: 'group',
        class: 'users',
        formatValue: (value: number) => value.toLocaleString()
      },
      {
        id: 'transactions',
        title: 'Transactions',
        value: stats.totalTransactions,
        change: stats.transactionsGrowthRate,
        icon: 'swap_horiz',
        class: 'transactions',
        formatValue: (value: number) => value.toLocaleString()
      },
      {
        id: 'revenue',
        title: 'Revenue',
        value: stats.totalRevenue,
        change: stats.revenueGrowthRate,
        icon: 'attach_money',
        class: 'revenue',
        prefix: 'MAD ',
        formatValue: (value: number) => value.toLocaleString('fr-MA', { minimumFractionDigits: 2 })
      },
      {
        id: 'agents',
        title: 'Active Agents',
        value: stats.activeAgents,
        change: stats.agentGrowthRate,
        icon: 'support_agent',
        class: 'agents',
        suffix: ` / ${stats.totalAgents}`,
        formatValue: (value: number) => value.toString()
      }
    ];

    // Update charts
    this.updateTransactionsChart(stats);
    this.updateRevenueChart(stats);
    this.updateCurrencyChart(stats);
    this.updateTransactionTypeChart(stats);

    // Update recent activity
    this.recentTransactions = stats.recentTransactions || [];
    this.recentAgentActivity = stats.recentAgentActivity || [];
  }

  private updateTransactionsChart(stats: StatsResponse): void {
    if (stats.transactionsByMonth) {
      const months = Object.keys(stats.transactionsByMonth);
      const values = Object.values(stats.transactionsByMonth);

      this.transactionsChartData = {
        labels: months,
        datasets: [
          {
            data: values,
            label: 'Transactions',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: '#3b82f6',
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            tension: 0.4,
            fill: true
          }
        ]
      };
    }
  }

  private updateRevenueChart(stats: StatsResponse): void {
    if (stats.revenueByMonth) {
      const months = Object.keys(stats.revenueByMonth);
      const values = Object.values(stats.revenueByMonth);

      this.revenueChartData = {
        labels: months,
        datasets: [
          {
            data: values,
            label: 'Revenue (MAD)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: '#10b981',
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            tension: 0.4,
            fill: true
          }
        ]
      };
    }
  }

  private updateCurrencyChart(stats: StatsResponse): void {
    if (stats.currencyDistribution) {
      const currencies = Object.keys(stats.currencyDistribution);
      const values = Object.values(stats.currencyDistribution);

      this.currencyChartData = {
        labels: currencies,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#3b82f6', // Blue
              '#10b981', // Green
              '#f59e0b', // Yellow
              '#8b5cf6', // Purple
              '#ef4444'  // Red
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      };
    }
  }

  private updateTransactionTypeChart(stats: StatsResponse): void {
    if (stats.transactionTypeDistribution) {
      const types = Object.keys(stats.transactionTypeDistribution);
      const values = Object.values(stats.transactionTypeDistribution);

      this.transactionTypeChartData = {
        labels: types,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#3b82f6', // Blue
              '#10b981', // Green
              '#f59e0b', // Yellow
              '#8b5cf6'  // Purple
            ],
            borderWidth: 1,
            borderColor: '#fff'
          }
        ]
      };
    }
  }

  onDateRangeChange(): void {
    this.loadDashboardData();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      default: return '';
    }
  }

  getTransactionTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'deposit': return 'deposit';
      case 'withdrawal': return 'withdrawal';
      case 'transfer': return 'transfer';
      case 'payment': return 'payment';
      default: return '';
    }
  }

  // Mock data fallback
  private getMockStats(): StatsResponse {
    return {
      totalUsers: 12486,
      totalAgents: 45,
      totalClients: 12441,
      activeAgents: 38,
      totalTransactions: 8745,
      totalRevenue: 543627.89,
      userGrowthRate: 12.5,
      transactionsGrowthRate: 8.3,
      revenueGrowthRate: -2.7,
      agentGrowthRate: 5.4,
      transactionsByMonth: {
        'Jan': 1200, 'Feb': 1450, 'Mar': 1680, 'Apr': 1520,
        'May': 1890, 'Jun': 2100, 'Jul': 1970, 'Aug': 2250,
        'Sep': 2180, 'Oct': 2340, 'Nov': 2480, 'Dec': 2650
      },
      revenueByMonth: {
        'Jan': 45200, 'Feb': 48300, 'Mar': 52100, 'Apr': 47800,
        'May': 54600, 'Jun': 58900, 'Jul': 56200, 'Aug': 61400,
        'Sep': 59700, 'Oct': 63800, 'Nov': 67200, 'Dec': 71500
      },
      currencyDistribution: {
        'MAD': 65, 'EUR': 20, 'USD': 12, 'GBP': 2, 'Other': 1
      },
      transactionTypeDistribution: {
        'Transfer': 45, 'Deposit': 30, 'Withdrawal': 20, 'Payment': 5
      },
      recentTransactions: [
        {
          id: 8745,
          type: 'Transfer',
          amount: 2500,
          currency: 'MAD',
          date: new Date(),
          status: 'Completed',
          clientName: 'Hassan Benali'
        },
        {
          id: 8744,
          type: 'Deposit',
          amount: 15000,
          currency: 'MAD',
          date: new Date(Date.now() - 1800000),
          status: 'Completed',
          clientName: 'Aicha Tazi'
        },
        {
          id: 8743,
          type: 'Withdrawal',
          amount: 800,
          currency: 'EUR',
          date: new Date(Date.now() - 3600000),
          status: 'Pending',
          clientName: 'Mohamed Idrissi'
        }
      ],
      recentAgentActivity: [
        {
          id: 1,
          name: 'Ahmed Alami',
          action: 'Processed large transfer',
          date: new Date(),
          details: 'Transfer of 50,000 MAD approved'
        },
        {
          id: 2,
          name: 'Fatima Bennani',
          action: 'Resolved account issue',
          date: new Date(Date.now() - 1800000),
          details: 'Account unlocked after verification'
        }
      ]
    };
  }
}
