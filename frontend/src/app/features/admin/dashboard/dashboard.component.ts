import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { StatsService, StatsResponse } from '@core/services/stats.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface Metric {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: string;
  class: string;
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
    NgChartsModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  userName = 'Admin';
  selectedDateRange = 'month';

  // Key metrics data
  keyMetrics: Metric[] = [];

  // Chargement des données
  loading = false;
  error = false;

  // Transactions Chart
  transactionsChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Transactions',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Currency Chart
  currencyChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
      }
    ]
  };

  // Chart options
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  // Recent transactions data
  recentTransactions: any[] = [];

  // Recent agent activity data
  recentAgentActivity: any[] = [];

  // Table columns
  transactionColumns: string[] = ['id', 'type', 'amount', 'date', 'status'];
  agentColumns: string[] = ['id', 'name', 'action', 'date'];

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = false;

    this.statsService.getStatsByPeriod(this.selectedDateRange)
      .pipe(
        catchError(error => {
          console.error('Error loading stats:', error);
          this.error = true;
          // Charge des données fictives en cas d'erreur
          return of(this.generateMockStats());
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((stats: StatsResponse) => {
        this.updateDashboardData(stats);
      });
  }

  updateDashboardData(stats: StatsResponse): void {
    // Mise à jour des métriques clés
    this.keyMetrics = [
      {
        id: 'users',
        title: 'Total Users',
        value: stats.totalUsers,
        change: stats.userGrowthRate,
        icon: 'group',
        class: 'users'
      },
      {
        id: 'transactions',
        title: 'Transactions',
        value: stats.totalTransactions,
        change: stats.transactionsGrowthRate,
        icon: 'swap_horiz',
        class: 'transactions'
      },
      {
        id: 'revenue',
        title: 'Revenue',
        value: stats.totalRevenue,
        change: stats.revenueGrowthRate,
        icon: 'attach_money',
        class: 'revenue'
      },
      {
        id: 'agents',
        title: 'Active Agents',
        value: stats.activeAgents,
        change: stats.agentGrowthRate,
        icon: 'support_agent',
        class: 'agents'
      }
    ];

    // Mise à jour du graphique des transactions
    if (stats.transactionsByMonth) {
      const months = Object.keys(stats.transactionsByMonth);
      const values = Object.values(stats.transactionsByMonth);

      this.transactionsChartData = {
        labels: months,
        datasets: [
          {
            data: values,
            label: 'Transactions',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            tension: 0.4,
            fill: true
          }
        ]
      };
    }

    // Mise à jour du graphique des devises
    if (stats.currencyDistribution) {
      const currencies = Object.keys(stats.currencyDistribution);
      const values = Object.values(stats.currencyDistribution);

      this.currencyChartData = {
        labels: currencies,
        datasets: [
          {
            data: values,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
          }
        ]
      };
    }

    // Mise à jour des activités récentes
    if (stats.recentTransactions) {
      this.recentTransactions = stats.recentTransactions;
    }

    if (stats.recentAgentActivity) {
      this.recentAgentActivity = stats.recentAgentActivity;
    }
  }

  onDateRangeChange(): void {
    this.loadStats();
  }

  // Génère des données fictives en cas d'erreur d'API
  generateMockStats(): StatsResponse {
    return {
      totalUsers: 12486,
      totalAgents: 150,
      activeAgents: 128,
      totalTransactions: 3245,
      totalRevenue: 54286,
      userGrowthRate: 12.5,
      transactionsGrowthRate: 8.3,
      revenueGrowthRate: -2.7,
      agentGrowthRate: 5.4,
      transactionsByMonth: {
        'Jan': 1200, 'Feb': 1900, 'Mar': 3000, 'Apr': 5000,
        'May': 4000, 'Jun': 3200, 'Jul': 3800, 'Aug': 4200,
        'Sep': 5100, 'Oct': 6800, 'Nov': 7300, 'Dec': 8200
      },
      currencyDistribution: {
        'USD': 45, 'EUR': 25, 'GBP': 15, 'JPY': 10, 'CAD': 5
      },
      recentTransactions: [
        {
          id: 1,
          type: 'Deposit',
          amount: 1200,
          currency: 'USD',
          date: new Date(),
          status: 'Completed'
        },
        {
          id: 2,
          type: 'Withdrawal',
          amount: 800,
          currency: 'EUR',
          date: new Date(Date.now() - 3600000),
          status: 'Completed'
        },
        {
          id: 3,
          type: 'Transfer',
          amount: 2500,
          currency: 'USD',
          date: new Date(Date.now() - 7200000),
          status: 'Pending'
        }
      ],
      recentAgentActivity: [
        {
          id: 1,
          name: 'John Doe',
          action: 'Created new client account',
          date: new Date()
        },
        {
          id: 2,
          name: 'Jane Smith',
          action: 'Processed withdrawal request',
          date: new Date(Date.now() - 3600000)
        },
        {
          id: 3,
          name: 'Robert Johnson',
          action: 'Updated client information',
          date: new Date(Date.now() - 7200000)
        }
      ]
    };
  }
}
