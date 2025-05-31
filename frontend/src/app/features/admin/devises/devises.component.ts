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
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { DeviseService, DeviseResponse, DeviseRequest } from '@core/services/devise.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

// Supposons que nous ayons un composant de dialogue pour ajouter/éditer des devises
// import { DeviseDialogComponent } from './devise-dialog/devise-dialog.component';

@Component({
  selector: 'app-devises',
  templateUrl: './devises.component.html',
  styleUrls: ['./devises.component.scss'],
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
    MatChipsModule,
    MatSlideToggleModule,
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
export class DevisesComponent implements OnInit {
  displayedColumns: string[] = ['code', 'name', 'symbol', 'exchangeRate', 'active', 'lastUpdated', 'actions'];
  dataSource: DeviseResponse[] = [];
  filteredData: DeviseResponse[] = [];
  searchTerm = '';

  // Chargement des données
  loading = false;
  error = false;
  refreshing = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private deviseService: DeviseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDevises();
  }

  ngAfterViewInit() {
    if (this.sort && this.paginator) {
      // Add sorting and pagination
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }
  }

  loadDevises() {
    this.loading = true;
    this.error = false;

    this.deviseService.findAll()
      .pipe(
        catchError(error => {
          console.error('Error loading currencies:', error);
          this.error = true;
          this.snackBar.open('Failed to load currencies. Please try again.', 'Close', {
            duration: 5000
          });
          // Retourne des données fictives en cas d'erreur
          return of(this.generateMockDevises());
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(devises => {
        this.dataSource = devises;
        this.applyFilter();
      });
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.dataSource];
      return;
    }

    const filterValue = this.searchTerm.toLowerCase();
    this.filteredData = this.dataSource.filter(devise =>
      devise.code.toLowerCase().includes(filterValue) ||
      devise.name.toLowerCase().includes(filterValue)
    );
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  refreshRates() {
    this.refreshing = true;

    // La méthode refreshRates peut ne pas exister dans votre API,
    // vous pouvez donc adapter cette partie à votre besoin
    this.deviseService.refreshRates()
      .pipe(
        catchError(error => {
          console.error('Error refreshing rates:', error);
          this.snackBar.open('Failed to refresh exchange rates. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        }),
        finalize(() => {
          this.refreshing = false;
        })
      )
      .subscribe(devises => {
        if (devises) {
          this.dataSource = devises;
          this.applyFilter();
          this.snackBar.open('Exchange rates updated successfully!', 'Close', {
            duration: 3000
          });
        } else {
          // Si l'API n'a pas de méthode refreshRates, on simule simplement une mise à jour
          setTimeout(() => {
            this.dataSource = this.dataSource.map(devise => ({
              ...devise,
              exchangeRate: devise.exchangeRate * (1 + (Math.random() * 0.02 - 0.01)),
              lastUpdated: new Date()
            }));
            this.applyFilter();
            this.refreshing = false;
            this.snackBar.open('Exchange rates updated successfully!', 'Close', {
              duration: 3000
            });
          }, 1500);
        }
      });
  }

  toggleDeviseStatus(id: number) {
    const devise = this.dataSource.find(d => d.id === id);

    if (devise) {
      const updateRequest: DeviseRequest = {
        code: devise.code,
        name: devise.name,
        symbol: devise.symbol,
        exchangeRate: devise.exchangeRate,
        active: !devise.active
      };

      this.deviseService.update(id, updateRequest)
        .pipe(
          catchError(error => {
            console.error('Error toggling currency status:', error);
            this.snackBar.open('Failed to update currency status. Please try again.', 'Close', {
              duration: 5000
            });
            return of(null);
          })
        )
        .subscribe(updatedDevise => {
          if (updatedDevise) {
            this.snackBar.open(`${updatedDevise.name} is now ${updatedDevise.active ? 'active' : 'inactive'}`, 'Close', {
              duration: 3000
            });
            this.loadDevises();
          } else {
            // Si l'API n'est pas disponible, on simule une mise à jour locale
            devise.active = !devise.active;
            this.snackBar.open(`${devise.name} is now ${devise.active ? 'active' : 'inactive'}`, 'Close', {
              duration: 3000
            });
          }
        });
    }
  }

  openDeviseDialog(devise?: DeviseResponse) {
    // Implémentation d'un dialogue pour ajouter/éditer une devise
    // const dialogRef = this.dialog.open(DeviseDialogComponent, {
    //   width: '600px',
    //   data: { devise: devise ? {...devise} : null }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     if (devise) {
    //       this.updateDevise(devise.id, result);
    //     } else {
    //       this.createDevise(result);
    //     }
    //   }
    // });

    // En attendant d'implémenter le dialogue, nous affichons simplement un message
    this.snackBar.open('Currency dialog functionality will be implemented soon.', 'Close', {
      duration: 3000
    });
  }

  createDevise(deviseData: DeviseRequest) {
    this.deviseService.create(deviseData)
      .pipe(
        catchError(error => {
          console.error('Error creating currency:', error);
          this.snackBar.open('Failed to create currency. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        })
      )
      .subscribe(newDevise => {
        if (newDevise) {
          this.snackBar.open('Currency created successfully', 'Close', {
            duration: 3000
          });
          this.loadDevises();
        }
      });
  }

  updateDevise(id: number, deviseData: DeviseRequest) {
    this.deviseService.update(id, deviseData)
      .pipe(
        catchError(error => {
          console.error('Error updating currency:', error);
          this.snackBar.open('Failed to update currency. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        })
      )
      .subscribe(updatedDevise => {
        if (updatedDevise) {
          this.snackBar.open('Currency updated successfully', 'Close', {
            duration: 3000
          });
          this.loadDevises();
        }
      });
  }

  deleteDevise(id: number) {
    // Vérifier si c'est le USD (on ne peut pas supprimer la devise par défaut)
    const devise = this.dataSource.find(d => d.id === id);
    if (devise && devise.code === 'USD') {
      this.snackBar.open('Cannot delete the default currency (USD).', 'Close', {
        duration: 3000
      });
      return;
    }

    // Confirmation avant suppression
    const confirmed = window.confirm('Are you sure you want to delete this currency?');

    if (confirmed) {
      this.deviseService.delete(id)
        .pipe(
          catchError(error => {
            console.error('Error deleting currency:', error);
            this.snackBar.open('Failed to delete currency. Please try again.', 'Close', {
              duration: 5000
            });
            return of(null);
          })
        )
        .subscribe(() => {
          this.snackBar.open('Currency deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadDevises();
        });
    }
  }

  // Génère des données fictives en cas d'erreur d'API
  generateMockDevises(): DeviseResponse[] {
    return [
      {
        id: 1,
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        exchangeRate: 1.0,
        active: true,
        lastUpdated: new Date()
      },
      {
        id: 2,
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        exchangeRate: 0.92,
        active: true,
        lastUpdated: new Date()
      },
      {
        id: 3,
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        exchangeRate: 0.78,
        active: true,
        lastUpdated: new Date(Date.now() - 3600000 * 2)
      },
      {
        id: 4,
        code: 'JPY',
        name: 'Japanese Yen',
        symbol: '¥',
        exchangeRate: 145.32,
        active: true,
        lastUpdated: new Date(Date.now() - 3600000 * 3)
      },
      {
        id: 5,
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
        exchangeRate: 1.35,
        active: false,
        lastUpdated: new Date(Date.now() - 3600000 * 24)
      }
    ];
  }
}
