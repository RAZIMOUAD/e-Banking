import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

interface SystemLog {
  id: number;
  timestamp: Date;
  level: string;
  source: string;
  message: string;
  details: string;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule
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
export class LogsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'timestamp', 'level', 'source', 'message', 'actions'];
  dataSource: SystemLog[] = [];
  filteredData: SystemLog[] = [];

  searchTerm = '';
  levelFilter = 'all';
  sourceFilter = 'all';
  startDate: Date | null = null;
  endDate: Date | null = null;

  selectedLog: SystemLog | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Mock data
  mockLogs: SystemLog[] = [
    {
      id: 1,
      timestamp: new Date(),
      level: 'ERROR',
      source: 'TransactionService',
      message: 'Failed to process transaction #12345',
      details: 'java.sql.SQLException: Connection refused\n\tat com.ebanking.service.TransactionService.processTransaction(TransactionService.java:125)\n\tat com.ebanking.controller.TransactionController.createTransaction(TransactionController.java:45)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1800000),
      level: 'WARN',
      source: 'SecurityService',
      message: 'Multiple failed login attempts for user admin@example.com',
      details: 'IP Address: 192.168.1.120\nAttempt count: 3\nLast attempt: 2023-11-25T14:32:45'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 3600000),
      level: 'INFO',
      source: 'UserService',
      message: 'User John Doe registered successfully',
      details: 'User ID: 156\nEmail: john.doe@example.com\nRole: CLIENT'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 7200000),
      level: 'DEBUG',
      source: 'DeviseService',
      message: 'Fetching latest exchange rates from API',
      details: 'Request URL: https://api.exchangerate.com/latest\nRequest headers: Authorization: Bearer ey...\nResponse status: 200 OK'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 86400000),
      level: 'ERROR',
      source: 'EmailService',
      message: 'Failed to send notification email',
      details: 'com.ebanking.exception.EmailException: SMTP connection timeout\n\tat com.ebanking.service.EmailService.sendEmail(EmailService.java:87)\n\tat com.ebanking.service.NotificationService.notifyUser(NotificationService.java:54)'
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 90000000),
      level: 'INFO',
      source: 'SystemService',
      message: 'Application started successfully',
      details: 'Environment: PRODUCTION\nVersion: 1.2.3\nJVM Version: 11.0.14\nAvailable memory: 4096MB'
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 92000000),
      level: 'WARN',
      source: 'CacheService',
      message: 'Cache eviction triggered due to memory pressure',
      details: 'Cache size before eviction: 256MB\nCache entries: 15420\nEvicted entries: 5240'
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load logs data - would come from API in production
    this.dataSource = [...this.mockLogs];
    this.filteredData = [...this.dataSource];

    // In a real application, you would fetch data from your backend API
    // this.loadLogs();
  }

  ngAfterViewInit() {
    if (this.sort && this.paginator) {
      // Add sorting and pagination
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }
  }

  loadLogs() {
    // Example API call
    this.http.get<SystemLog[]>('/api/v1/admin/logs').subscribe({
      next: (logs) => {
        this.dataSource = logs;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading system logs:', error);
      }
    });
  }

  applyFilters() {
    let filteredLogs = [...this.dataSource];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(searchTermLower) ||
        log.source.toLowerCase().includes(searchTermLower) ||
        log.details.toLowerCase().includes(searchTermLower)
      );
    }

    // Apply level filter
    if (this.levelFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === this.levelFilter);
    }

    // Apply source filter
    if (this.sourceFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.source === this.sourceFilter);
    }

    // Apply date range filter
    if (this.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= this.startDate!);
    }

    if (this.endDate) {
      // Add one day to include the end date in the range
      const endDatePlusOne = new Date(this.endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      filteredLogs = filteredLogs.filter(log => log.timestamp < endDatePlusOne);
    }

    this.filteredData = filteredLogs;
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  getLevelFilters(): string[] {
    return ['ERROR', 'WARN', 'INFO', 'DEBUG'];
  }

  getSourceFilters(): string[] {
    // In a real app, you would dynamically fetch this from the logs
    return Array.from(new Set(this.dataSource.map(log => log.source)));
  }

  onLevelFilterChange(level: string) {
    this.levelFilter = level;
    this.applyFilters();
  }

  onSourceFilterChange(source: string) {
    this.sourceFilter = source;
    this.applyFilters();
  }

  onDateRangeChange() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.levelFilter = 'all';
    this.sourceFilter = 'all';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  viewLogDetails(log: SystemLog) {
    this.selectedLog = log;
  }

  clearSelectedLog() {
    this.selectedLog = null;
  }

  exportToFile() {
    // Would implement export to file functionality
    console.log('Exporting logs to file...');
  }
}
