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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

interface AuditLog {
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
}

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
export class AuditComponent implements OnInit {
  displayedColumns: string[] = ['id', 'timestamp', 'userName', 'userRole', 'action', 'entity', 'entityId', 'status', 'ipAddress', 'details'];
  dataSource: AuditLog[] = [];
  filteredData: AuditLog[] = [];

  searchTerm = '';
  actionFilter = 'all';
  entityFilter = 'all';
  startDate: Date | null = null;
  endDate: Date | null = null;

  availableActions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'TRANSFER', 'DEPOSIT', 'WITHDRAWAL'];
  availableEntities = ['USER', 'AGENT', 'CLIENT', 'ACCOUNT', 'TRANSACTION', 'DEVISE', 'SYSTEM'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Mock data
  mockAuditLogs: AuditLog[] = [
    {
      id: 1,
      action: 'CREATE',
      entity: 'AGENT',
      entityId: 15,
      userId: 1,
      userName: 'Admin User',
      userRole: 'ADMIN',
      timestamp: new Date(),
      details: 'Created new agent account for John Doe',
      ipAddress: '192.168.1.105',
      status: 'SUCCESS'
    },
    {
      id: 2,
      action: 'LOGIN',
      entity: 'USER',
      entityId: 1,
      userId: 1,
      userName: 'Admin User',
      userRole: 'ADMIN',
      timestamp: new Date(Date.now() - 3600000),
      details: 'Admin login from dashboard',
      ipAddress: '192.168.1.105',
      status: 'SUCCESS'
    },
    {
      id: 3,
      action: 'UPDATE',
      entity: 'DEVISE',
      entityId: 2,
      userId: 1,
      userName: 'Admin User',
      userRole: 'ADMIN',
      timestamp: new Date(Date.now() - 7200000),
      details: 'Updated EUR exchange rate from 0.92 to 0.91',
      ipAddress: '192.168.1.105',
      status: 'SUCCESS'
    },
    {
      id: 4,
      action: 'DELETE',
      entity: 'AGENT',
      entityId: 12,
      userId: 1,
      userName: 'Admin User',
      userRole: 'ADMIN',
      timestamp: new Date(Date.now() - 86400000),
      details: 'Deleted inactive agent account',
      ipAddress: '192.168.1.105',
      status: 'SUCCESS'
    },
    {
      id: 5,
      action: 'TRANSFER',
      entity: 'TRANSACTION',
      entityId: 345,
      userId: 5,
      userName: 'John Agent',
      userRole: 'AGENT',
      timestamp: new Date(Date.now() - 172800000),
      details: 'Transfer of 5000 USD from account #12345 to account #67890',
      ipAddress: '192.168.1.110',
      status: 'SUCCESS'
    },
    {
      id: 6,
      action: 'LOGIN',
      entity: 'USER',
      entityId: 5,
      userId: 5,
      userName: 'John Agent',
      userRole: 'AGENT',
      timestamp: new Date(Date.now() - 180000000),
      details: 'Failed login attempt',
      ipAddress: '192.168.1.110',
      status: 'FAILURE'
    },
    {
      id: 7,
      action: 'WITHDRAWAL',
      entity: 'TRANSACTION',
      entityId: 346,
      userId: 5,
      userName: 'John Agent',
      userRole: 'AGENT',
      timestamp: new Date(Date.now() - 190000000),
      details: 'Withdrawal of 2000 EUR from account #12345',
      ipAddress: '192.168.1.110',
      status: 'SUCCESS'
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load audit logs data - would come from API in production
    this.dataSource = [...this.mockAuditLogs];
    this.filteredData = [...this.dataSource];

    // In a real application, you would fetch data from your backend API
    // this.loadAuditLogs();
  }

  ngAfterViewInit() {
    if (this.sort && this.paginator) {
      // Add sorting and pagination
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }
  }

  loadAuditLogs() {
    // Example API call
    this.http.get<AuditLog[]>('/api/v1/admin/audit').subscribe({
      next: (logs) => {
        this.dataSource = logs;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
      }
    });
  }

  applyFilters() {
    let filteredLogs = [...this.dataSource];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.userName.toLowerCase().includes(searchTermLower) ||
        log.details.toLowerCase().includes(searchTermLower) ||
        log.ipAddress.includes(searchTermLower)
      );
    }

    // Apply action filter
    if (this.actionFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.action === this.actionFilter);
    }

    // Apply entity filter
    if (this.entityFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.entity === this.entityFilter);
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

  onActionFilterChange(action: string) {
    this.actionFilter = action;
    this.applyFilters();
  }

  onEntityFilterChange(entity: string) {
    this.entityFilter = entity;
    this.applyFilters();
  }

  onDateRangeChange() {
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.actionFilter = 'all';
    this.entityFilter = 'all';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  exportToCSV() {
    // Would implement export to CSV functionality
    console.log('Exporting audit logs to CSV...');
  }
}
