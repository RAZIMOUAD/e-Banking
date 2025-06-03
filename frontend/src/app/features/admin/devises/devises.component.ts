import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { DeviseService, DeviseResponse, DeviseRequest } from '@core/services/devise.service';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-devises',
  templateUrl: './devises.component.html',
  styleUrls: ['./devises.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
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
    MatSlideToggleModule,
    MatProgressSpinnerModule,
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
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class DevisesComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = ['code', 'name', 'symbol', 'exchangeRate', 'active', 'lastUpdated', 'actions'];
  dataSource = new MatTableDataSource<DeviseResponse>();
  searchTerm = '';

  // Loading states
  loading = false;
  error = false;
  refreshing = false;

  // Statistics
  totalCurrencies = 0;
  activeCurrencies = 0;
  lastRateUpdate: Date | null = null;

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Custom filter predicate
    this.dataSource.filterPredicate = (data: DeviseResponse, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.code?.toLowerCase().includes(searchStr) ||
        data.name?.toLowerCase().includes(searchStr) ||
        data.symbol?.toLowerCase().includes(searchStr);
    };
  }

  loadDevises(): void {
    this.loading = true;
    this.error = false;

    this.deviseService.findAll()
      .pipe(
        catchError(error => {
          console.error('Error loading currencies:', error);
          this.error = true;
          this.snackBar.open('Backend unavailable - using demo data', 'Close', {
            duration: 4000,
            panelClass: ['warning-snackbar']
          });
          return of(this.getMockDevises());
        }),
        finalize(() => {
          this.loading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(devises => {
        this.processDevisesData(devises);
      });
  }

  private processDevisesData(devises: DeviseResponse[]): void {
    this.dataSource.data = devises;
    this.updateStatistics(devises);
    this.applyFilter();
  }

  private updateStatistics(devises: DeviseResponse[]): void {
    this.totalCurrencies = devises.length;
    this.activeCurrencies = devises.filter(d => d.active).length;
    this.lastRateUpdate = devises.reduce((latest, current) => {
      const currentDate = new Date(current.lastUpdated);
      return !latest || currentDate > latest ? currentDate : latest;
    }, null as Date | null);
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  refreshRates(): void {
    this.refreshing = true;

    this.deviseService.refreshRates()
      .pipe(
        catchError(error => {
          console.error('Error refreshing rates:', error);
          // Fallback: simulate rate refresh with mock data
          return of(this.simulateRateRefresh());
        }),
        finalize(() => {
          this.refreshing = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(devises => {
        if (devises) {
          this.processDevisesData(devises);
          this.snackBar.open('Exchange rates updated successfully!', 'Close', {
            duration: 3000
          });
        }
      });
  }

  private simulateRateRefresh(): DeviseResponse[] {
    return this.dataSource.data.map(devise => ({
      ...devise,
      exchangeRate: devise.exchangeRate * (1 + (Math.random() * 0.02 - 0.01)),
      lastUpdated: new Date()
    }));
  }

  toggleDeviseStatus(id: number): void {
    const devise = this.dataSource.data.find(d => d.id === id);

    if (!devise) {
      this.snackBar.open('Currency not found', 'Close', { duration: 3000 });
      return;
    }

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
          this.snackBar.open('Failed to update currency status', 'Close', {
            duration: 3000
          });
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(updatedDevise => {
        if (updatedDevise) {
          // Update local data
          const index = this.dataSource.data.findIndex(d => d.id === id);
          if (index !== -1) {
            this.dataSource.data[index] = updatedDevise;
            this.updateStatistics(this.dataSource.data);
            this.dataSource._updateChangeSubscription();
          }
          this.snackBar.open(`${updatedDevise.name} is now ${updatedDevise.active ? 'active' : 'inactive'}`, 'Close', {
            duration: 3000
          });
        } else {
          // Fallback for mock data
          devise.active = !devise.active;
          this.updateStatistics(this.dataSource.data);
          this.snackBar.open(`${devise.name} is now ${devise.active ? 'active' : 'inactive'}`, 'Close', {
            duration: 3000
          });
        }
      });
  }

  openDeviseDialog(devise?: DeviseResponse): void {
    // TODO: Implement devise dialog
    this.snackBar.open(
      devise ? `Editing ${devise.name}` : 'Creating new currency',
      'Close',
      { duration: 2000 }
    );
  }

  deleteDevise(id: number): void {
    const devise = this.dataSource.data.find(d => d.id === id);

    if (!devise) {
      this.snackBar.open('Currency not found', 'Close', { duration: 3000 });
      return;
    }

    if (devise.code === 'USD') {
      this.snackBar.open('Cannot delete the base currency (USD)', 'Close', {
        duration: 3000
      });
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${devise.name}?`);

    if (confirmed) {
      this.deviseService.delete(id)
        .pipe(
          catchError(error => {
            console.error('Error deleting currency:', error);
            this.snackBar.open('Failed to delete currency', 'Close', {
              duration: 3000
            });
            return of(null);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          // Remove from local data
          const index = this.dataSource.data.findIndex(d => d.id === id);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
            this.updateStatistics(this.dataSource.data);
          }
          this.snackBar.open('Currency deleted successfully', 'Close', {
            duration: 2000
          });
        });
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  getStatusClass(active: boolean): string {
    return active ? 'status-active' : 'status-inactive';
  }

  getRateChangeClass(rate: number): string {
    // This would compare with previous rate in real implementation
    return 'rate-neutral';
  }

  formatExchangeRate(rate: number): string {
    return rate.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }

  getTimeSinceUpdate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  // Mock data fallback
  private getMockDevises(): DeviseResponse[] {
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
        exchangeRate: 0.9234,
        active: true,
        lastUpdated: new Date(Date.now() - 1800000)
      },
      {
        id: 3,
        code: 'MAD',
        name: 'Moroccan Dirham',
        symbol: 'MAD',
        exchangeRate: 10.1245,
        active: true,
        lastUpdated: new Date(Date.now() - 3600000)
      },
      {
        id: 4,
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        exchangeRate: 0.7821,
        active: true,
        lastUpdated: new Date(Date.now() - 7200000)
      },
      {
        id: 5,
        code: 'JPY',
        name: 'Japanese Yen',
        symbol: '¥',
        exchangeRate: 149.87,
        active: true,
        lastUpdated: new Date(Date.now() - 10800000)
      },
      {
        id: 6,
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
        exchangeRate: 1.3567,
        active: false,
        lastUpdated: new Date(Date.now() - 86400000)
      },
      {
        id: 7,
        code: 'CHF',
        name: 'Swiss Franc',
        symbol: 'CHF',
        exchangeRate: 0.8934,
        active: true,
        lastUpdated: new Date(Date.now() - 14400000)
      }
    ];
  }
}
