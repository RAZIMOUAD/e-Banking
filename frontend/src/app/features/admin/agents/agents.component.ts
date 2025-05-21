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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { trigger, transition, style, animate } from '@angular/animations';
import { AgentService, AgentResponse, AgentRequest } from '@core/services/agent.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

// Supposons que nous ayons un composant de dialogue pour ajouter/éditer des agents
// import { AgentDialogComponent } from './agent-dialog/agent-dialog.component';

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
    MatBadgeModule
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
  dataSource: AgentResponse[] = [];
  filteredData: AgentResponse[] = [];
  searchTerm = '';
  statusFilter = 'all';

  // Chargement des données
  loading = false;
  error = false;

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
    if (this.sort && this.paginator) {
      // Add sorting and pagination
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }
  }

  loadAgents() {
    this.loading = true;
    this.error = false;

    this.agentService.findAll()
      .pipe(
        catchError(error => {
          console.error('Error loading agents:', error);
          this.error = true;
          this.snackBar.open('Failed to load agents. Please try again.', 'Close', {
            duration: 5000
          });
          // Retourne des données fictives en cas d'erreur
          return of(this.generateMockAgents());
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(agents => {
        this.dataSource = agents;
        this.applyFilters();
      });
  }

  applyFilters() {
    let filteredAgents = [...this.dataSource];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredAgents = filteredAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchTermLower) ||
        agent.email.toLowerCase().includes(searchTermLower) ||
        agent.phone.includes(searchTermLower)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filteredAgents = filteredAgents.filter(agent => agent.status === this.statusFilter);
    }

    this.filteredData = filteredAgents;
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
    // Implémentation d'un dialogue pour ajouter/éditer un agent
    // const dialogRef = this.dialog.open(AgentDialogComponent, {
    //   width: '600px',
    //   data: { agent: agent ? {...agent} : null }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     if (agent) {
    //       this.updateAgent(agent.id, result);
    //     } else {
    //       this.createAgent(result);
    //     }
    //   }
    // });

    // En attendant d'implémenter le dialogue, nous affichons simplement un message
    this.snackBar.open('Agent dialog functionality will be implemented soon.', 'Close', {
      duration: 3000
    });
  }

  createAgent(agentData: AgentRequest) {
    this.agentService.create(agentData)
      .pipe(
        catchError(error => {
          console.error('Error creating agent:', error);
          this.snackBar.open('Failed to create agent. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        })
      )
      .subscribe(newAgent => {
        if (newAgent) {
          this.snackBar.open('Agent created successfully', 'Close', {
            duration: 3000
          });
          this.loadAgents();
        }
      });
  }

  updateAgent(id: number, agentData: AgentRequest) {
    this.agentService.update(id, agentData)
      .pipe(
        catchError(error => {
          console.error('Error updating agent:', error);
          this.snackBar.open('Failed to update agent. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        })
      )
      .subscribe(updatedAgent => {
        if (updatedAgent) {
          this.snackBar.open('Agent updated successfully', 'Close', {
            duration: 3000
          });
          this.loadAgents();
        }
      });
  }

  deleteAgent(id: number) {
    // Confirmation avant suppression
    const confirmed = window.confirm('Are you sure you want to delete this agent?');

    if (confirmed) {
      this.agentService.delete(id)
        .pipe(
          catchError(error => {
            console.error('Error deleting agent:', error);
            this.snackBar.open('Failed to delete agent. Please try again.', 'Close', {
              duration: 5000
            });
            return of(null);
          })
        )
        .subscribe(() => {
          this.snackBar.open('Agent deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadAgents();
        });
    }
  }

  changeAgentStatus(id: number, status: string) {
    // Trouver l'agent actuel
    const agent = this.dataSource.find(a => a.id === id);

    if (agent) {
      // Créer la requête de mise à jour avec le nouveau statut
      const updateRequest: AgentRequest = {
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        status: status
      };

      // Appeler le service de mise à jour
      this.agentService.update(id, updateRequest)
        .pipe(
          catchError(error => {
            console.error('Error updating agent status:', error);
            this.snackBar.open('Failed to update agent status. Please try again.', 'Close', {
              duration: 5000
            });
            return of(null);
          })
        )
        .subscribe(updatedAgent => {
          if (updatedAgent) {
            this.snackBar.open(`Agent status changed to ${status}`, 'Close', {
              duration: 3000
            });
            this.loadAgents();
          }
        });
    }
  }

  // Génère des données fictives en cas d'erreur d'API
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
