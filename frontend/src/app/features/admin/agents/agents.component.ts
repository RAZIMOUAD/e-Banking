import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { trigger, transition, style, animate } from '@angular/animations';
import { AgentService, AgentResponse, AgentRequest } from '@core/services/agent.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
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
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatDividerModule
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
export class AgentsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'status', 'registrationDate', 'lastActive', 'transactionsCount', 'actions'];
  dataSource = new MatTableDataSource<AgentResponse>();
  searchTerm = '';
  statusFilter = 'all';

  // Loading states
  loading = false;
  error = false;

  // Statistics
  totalAgents = 0;
  activeAgents = 0;
  inactiveAgents = 0;
  suspendedAgents = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private agentService: AgentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Custom filter predicate
    this.dataSource.filterPredicate = (data: AgentResponse, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.name?.toLowerCase().includes(searchStr) ||
        data.email?.toLowerCase().includes(searchStr) ||
        data.phone?.includes(searchStr);
    };
  }

  loadAgents() {
    this.loading = true;
    this.error = false;

    this.agentService.findAll()
      .pipe(
        catchError(error => {
          console.error('Error loading agents:', error);
          this.error = true;
          this.snackBar.open('Backend unavailable - using demo data', 'Close', {
            duration: 4000,
            panelClass: ['warning-snackbar']
          });
          return of(this.generateMockAgents());
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(agents => {
        this.processAgentsData(agents);
      });
  }

  private processAgentsData(agents: AgentResponse[]): void {
    this.dataSource.data = agents;
    this.updateStatistics(agents);
    this.applyFilters();
  }

  private updateStatistics(agents: AgentResponse[]): void {
    this.totalAgents = agents.length;
    this.activeAgents = agents.filter(a => a.status === 'Active').length;
    this.inactiveAgents = agents.filter(a => a.status === 'Inactive').length;
    this.suspendedAgents = agents.filter(a => a.status === 'Suspended').length;
  }

  applyFilters() {
    let filteredAgents = [...this.dataSource.data];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredAgents = filteredAgents.filter(agent =>
        agent.name?.toLowerCase().includes(searchTermLower) ||
        agent.email?.toLowerCase().includes(searchTermLower) ||
        agent.phone?.includes(searchTermLower)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filteredAgents = filteredAgents.filter(agent => agent.status === this.statusFilter);
    }

    this.dataSource.data = filteredAgents;
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onStatusFilterChange(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  openAgentDialog(agent?: AgentResponse) {
    // For now, show a simple prompt-based dialog
    // In production, you'd use a proper Angular Material Dialog

    if (agent) {
      // Edit existing agent
      const name = prompt('Enter agent name:', agent.name);
      const email = prompt('Enter agent email:', agent.email);
      const phone = prompt('Enter agent phone:', agent.phone);
      const service = prompt('Enter agent service:', agent.service || '');

      if (name && phone) {
        const updateRequest = this.agentService.transformFrontendToBackend({
          name: name.trim(),
          email: email?.trim(),
          phone: phone.trim(),
          service: service?.trim()
        });
        this.updateAgent(agent.id!, updateRequest);
      }
    } else {
      // Create new agent
      const name = prompt('Enter agent name:');
      const email = prompt('Enter agent email:');
      const phone = prompt('Enter agent phone:');
      const service = prompt('Enter agent service:');

      if (name && phone) {
        const createRequest = this.agentService.transformFrontendToBackend({
          name: name.trim(),
          email: email?.trim(),
          phone: phone.trim(),
          service: service?.trim()
        });
        this.createAgent(createRequest);
      }
    }
  }

  createAgent(agentData: any) {
    this.loading = true;
    this.agentService.create(agentData)
      .pipe(
        catchError(error => {
          console.error('Error creating agent:', error);
          this.snackBar.open('Failed to create agent. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(newAgent => {
        if (newAgent) {
          this.snackBar.open('Agent created successfully', 'Close', {
            duration: 3000
          });
          this.loadAgents(); // Reload the list
        }
      });
  }

  updateAgent(id: number, agentData: any) {
    this.loading = true;
    this.agentService.update(id, agentData)
      .pipe(
        catchError(error => {
          console.error('Error updating agent:', error);
          this.snackBar.open('Failed to update agent. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(updatedAgent => {
        if (updatedAgent) {
          this.snackBar.open('Agent updated successfully', 'Close', {
            duration: 3000
          });
          this.loadAgents(); // Reload the list
        }
      });
  }

  deleteAgent(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this agent? This action cannot be undone.');

    if (confirmed) {
      this.loading = true;
      this.agentService.delete(id)
        .pipe(
          catchError(error => {
            console.error('Error deleting agent:', error);
            this.snackBar.open('Failed to delete agent. Please try again.', 'Close', {
              duration: 5000
            });
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(() => {
          this.snackBar.open('Agent deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadAgents(); // Reload the list
        });
    }
  }

  changeAgentStatus(id: number, status: string) {
    const agent = this.dataSource.data.find(a => a.id === id);

    if (agent) {
      const updateRequest = this.agentService.transformFrontendToBackend({
        ...agent,
        status: status
      });

      this.loading = true;
      this.agentService.update(id, updateRequest)
        .pipe(
          catchError(error => {
            console.error('Error updating agent status:', error);
            this.snackBar.open('Failed to update agent status. Please try again.', 'Close', {
              duration: 5000
            });
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(updatedAgent => {
          if (updatedAgent) {
            this.snackBar.open(`Agent status changed to ${status}`, 'Close', {
              duration: 3000
            });
            this.loadAgents(); // Reload the list
          }
        });
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  // Mock data for fallback
  generateMockAgents(): AgentResponse[] {
    return [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        status: 'Active',
        registrationDate: new Date(2023, 5, 15),
        lastActive: new Date(),
        transactionsCount: 156
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 987-6543',
        status: 'Active',
        registrationDate: new Date(2023, 7, 22),
        lastActive: new Date(Date.now() - 3600000 * 24 * 2),
        transactionsCount: 89
      },
      {
        id: 3,
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 456-7890',
        status: 'Suspended',
        registrationDate: new Date(2023, 2, 10),
        lastActive: new Date(Date.now() - 3600000 * 24 * 30),
        transactionsCount: 45
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1 (555) 789-0123',
        status: 'Active',
        registrationDate: new Date(2023, 10, 5),
        lastActive: new Date(Date.now() - 3600000 * 3),
        transactionsCount: 112
      },
      {
        id: 5,
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        phone: '+1 (555) 234-5678',
        status: 'Inactive',
        registrationDate: new Date(2023, 1, 28),
        lastActive: new Date(Date.now() - 3600000 * 24 * 60),
        transactionsCount: 67
      }
    ];
  }
}
