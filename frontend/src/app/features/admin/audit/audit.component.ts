import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { AuditService, AuditLog, AuditFilter } from '@core/services/audit.service';
import { catchError, finalize, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
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
    ]),
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger('30ms', animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class AuditComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new BehaviorSubject<string>('');

  displayedColumns: string[] = ['timestamp', 'user', 'action', 'entity', 'status', 'location', 'details'];
  dataSource = new MatTableDataSource<AuditLog>();

  // Filter properties
  searchTerm = '';
  actionFilter = 'all';
  entityFilter = 'all';
  userRoleFilter = 'all';
  statusFilter = 'all';
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Available filter options
  availableActions: string[] = [];
  availableEntities: string[] = [];
  availableUserRoles = ['ADMIN', 'AGENT', 'CLIENT'];
  availableStatuses = ['SUCCESS', 'FAILURE', 'PENDING', 'BLOCKED'];

  // Loading states
  loading = false;
  error = false;
  exporting = false;

  // Statistics
  totalLogs = 0;
  successfulActions = 0;
  failedActions = 0;
  suspiciousActivities = 0;

  // Selected log for detail view
  selectedLog: AuditLog | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private auditService: AuditService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAuditLogs();
    this.loadFilterOptions();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.searchTerm = searchTerm;
        this.applyFilters();
      });
  }

  loadAuditLogs(): void {
    this.loading = true;
    this.error = false;

    const filter: AuditFilter = {
      action: this.actionFilter !== 'all' ? this.actionFilter : undefined,
      entity: this.entityFilter !== 'all' ? this.entityFilter : undefined,
      userRole: this.userRoleFilter !== 'all' ? this.userRoleFilter : undefined,
      status: this.statusFilter !== 'all' ? this.statusFilter : undefined,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined
    };

    this.auditService.getAuditLogs(filter)
      .pipe(
        catchError(error => {
          console.error('Error loading audit logs:', error);
          this.error = true;
          this.snackBar.open('Backend unavailable - using demo data', 'Close', {
            duration: 4000,
            panelClass: ['warning-snackbar']
          });
          return of(this.getMockAuditLogs());
        }),
        finalize(() => {
          this.loading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(logs => {
        this.processAuditData(logs);
      });
  }

  private loadFilterOptions(): void {
    // Load available actions
    this.auditService.getAvailableActions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(actions => {
        this.availableActions = actions;
      });

    // Load available entities
    this.auditService.getAvailableEntities()
      .pipe(takeUntil(this.destroy$))
      .subscribe(entities => {
        this.availableEntities = entities;
      });
  }

  private processAuditData(logs: AuditLog[]): void {
    this.dataSource.data = logs;
    this.updateStatistics(logs);
    this.applyFilters();
  }

  private updateStatistics(logs: AuditLog[]): void {
    this.totalLogs = logs.length;
    this.successfulActions = logs.filter(log => log.status === 'SUCCESS').length;
    this.failedActions = logs.filter(log => log.status === 'FAILURE').length;
    this.suspiciousActivities = logs.filter(log =>
      log.status === 'BLOCKED' ||
      log.action === 'DELETE' ||
      (log.action === 'LOGIN' && log.status === 'FAILURE')
    ).length;
  }

  applyFilters(): void {
    let filteredData = [...this.dataSource.data];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(log =>
        log.userName.toLowerCase().includes(searchTermLower) ||
        log.details.toLowerCase().includes(searchTermLower) ||
        log.ipAddress.includes(searchTermLower) ||
        log.action.toLowerCase().includes(searchTermLower) ||
        log.entity.toLowerCase().includes(searchTermLower)
      );
    }

    // Apply other filters
    if (this.actionFilter !== 'all') {
      filteredData = filteredData.filter(log => log.action === this.actionFilter);
    }

    if (this.entityFilter !== 'all') {
      filteredData = filteredData.filter(log => log.entity === this.entityFilter);
    }

    if (this.userRoleFilter !== 'all') {
      filteredData = filteredData.filter(log => log.userRole === this.userRoleFilter);
    }

    if (this.statusFilter !== 'all') {
      filteredData = filteredData.filter(log => log.status === this.statusFilter);
    }

    // Apply date range filter
    if (this.startDate) {
      filteredData = filteredData.filter(log =>
        new Date(log.timestamp) >= this.startDate!
      );
    }

    if (this.endDate) {
      const endDatePlusOne = new Date(this.endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      filteredData = filteredData.filter(log =>
        new Date(log.timestamp) < endDatePlusOne
      );
    }

    // Update data source with filtered data
    this.dataSource.data = filteredData;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onDateRangeChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.actionFilter = 'all';
    this.entityFilter = 'all';
    this.userRoleFilter = 'all';
    this.statusFilter = 'all';
    this.startDate = null;
    this.endDate = null;
    this.searchSubject.next('');
    this.loadAuditLogs();
  }

  viewLogDetails(log: AuditLog): void {
    this.selectedLog = this.selectedLog?.id === log.id ? null : log;
  }

  closeLogDetails(): void {
    this.selectedLog = null;
  }

  exportLogs(): void {
    this.exporting = true;

    const filter: AuditFilter = {
      action: this.actionFilter !== 'all' ? this.actionFilter : undefined,
      entity: this.entityFilter !== 'all' ? this.entityFilter : undefined,
      userRole: this.userRoleFilter !== 'all' ? this.userRoleFilter : undefined,
      status: this.statusFilter !== 'all' ? this.statusFilter : undefined,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined
    };

    this.auditService.exportAuditLogs(filter)
      .pipe(
        catchError(error => {
          console.error('Error exporting logs:', error);
          this.snackBar.open('Export failed - feature not available', 'Close', {
            duration: 3000
          });
          return of(null);
        }),
        finalize(() => {
          this.exporting = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(blob => {
        if (blob) {
          this.downloadFile(blob, 'audit-logs.csv');
          this.snackBar.open('Logs exported successfully', 'Close', {
            duration: 2000
          });
        } else {
          // Fallback: create CSV from current data
          this.exportCurrentData();
        }
      });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private exportCurrentData(): void {
    const csvContent = this.convertToCSV(this.dataSource.data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    this.downloadFile(blob, `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    this.snackBar.open('Logs exported successfully', 'Close', {
      duration: 2000
    });
  }

  private convertToCSV(data: AuditLog[]): string {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Entity', 'Status', 'IP Address', 'Details'];
    const csvRows = [headers.join(',')];

    data.forEach(log => {
      const row = [
        new Date(log.timestamp).toISOString(),
        log.userName,
        log.userRole,
        log.action,
        log.entity,
        log.status,
        log.ipAddress,
        `"${log.details.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  // Helper methods for UI
  getActionIcon(action: string): string {
    switch (action.toLowerCase()) {
      case 'create': return 'add_circle';
      case 'read': return 'visibility';
      case 'update': return 'edit';
      case 'delete': return 'delete';
      case 'login': return 'login';
      case 'logout': return 'logout';
      case 'transfer': return 'swap_horiz';
      case 'deposit': return 'add';
      case 'withdrawal': return 'remove';
      default: return 'help';
    }
  }

  getActionClass(action: string): string {
    switch (action.toLowerCase()) {
      case 'create': return 'action-create';
      case 'read': return 'action-read';
      case 'update': return 'action-update';
      case 'delete': return 'action-delete';
      case 'login': case 'logout': return 'action-auth';
      case 'transfer': case 'deposit': case 'withdrawal': return 'action-transaction';
      default: return 'action-default';
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'success': return 'status-success';
      case 'failure': return 'status-failure';
      case 'pending': return 'status-pending';
      case 'blocked': return 'status-blocked';
      default: return 'status-default';
    }
  }

  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin': return 'role-admin';
      case 'agent': return 'role-agent';
      case 'client': return 'role-client';
      default: return 'role-default';
    }
  }

  formatTimestamp(timestamp: Date): string {
    return new Date(timestamp).toLocaleString();
  }

  getLocationDisplay(ipAddress: string, location?: string): string {
    return location || `IP: ${ipAddress}`;
  }

  // Mock data fallback
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
        timestamp: new Date(now.getTime() - 300000),
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
        timestamp: new Date(now.getTime() - 3600000),
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
        timestamp: new Date(now.getTime() - 7200000),
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
        timestamp: new Date(now.getTime() - 1800000),
        details: 'Processed transfer of 2,500 MAD from account 12345 to account 67890',
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
        entityId: 5,
        userId: 5,
        userName: 'Ahmed Alami',
        userRole: 'AGENT',
        timestamp: new Date(now.getTime() - 5400000),
        details: 'Failed login attempt - incorrect password',
        ipAddress: '192.168.1.110',
        status: 'FAILURE',
        sessionId: '',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Rabat, Morocco'
      },
      {
        id: 6,
        action: 'DELETE',
        entity: 'AGENT',
        entityId: 12,
        userId: 1,
        userName: 'Admin User',
        userRole: 'ADMIN',
        timestamp: new Date(now.getTime() - 86400000),
        details: 'Deleted inactive agent account (matricule: AGT012)',
        ipAddress: '192.168.1.105',
        status: 'SUCCESS',
        sessionId: 'sess_admin_001',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Casablanca, Morocco'
      }
    ];
  }
}
