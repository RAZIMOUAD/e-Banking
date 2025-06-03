import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { DeviseService, DeviseResponse, DeviseRequest, DeviseStatistics } from '@core/services/devise.service';
import { catchError, finalize, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject, BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-devises',
  templateUrl: './devises.component.html',
  styleUrls: ['./devises.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger('100ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })))
        ], { optional: true })
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class DevisesComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private searchSubject$ = new BehaviorSubject<string>('');

  // Table configuration
  displayedColumns: string[] = ['code', 'libelle', 'tauxConversion', 'conversion', 'actions'];
  dataSource = new MatTableDataSource<DeviseResponse>();

  // Search and filtering
  searchTerm = '';
  filteredDevises$ = new BehaviorSubject<DeviseResponse[]>([]);

  // Loading states
  loading = false;
  refreshing = false;
  saving = false;
  deleting = new Set<number>();

  // Statistics
  statistics: DeviseStatistics | null = null;

  // Forms
  deviseForm!: FormGroup;
  converterForm!: FormGroup;
  isEditMode = false;
  editingDevise: DeviseResponse | null = null;

  // UI state
  showForm = false;
  showConverter = false;
  selectedBaseCurrency = 'MAD';
  conversionResult: number | null = null;

  // Popular currencies for quick actions
  popularCurrencies: string[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private deviseService: DeviseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForms();
    this.popularCurrencies = this.deviseService.getPopularCurrencies();
  }

  ngOnInit(): void {
    this.setupSearchSubscription();
    this.loadDevises();
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setupCustomFiltering();
  }

  /**
   * Initialize reactive forms
   */
  private initializeForms(): void {
    this.deviseForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      tauxConversion: ['', [Validators.required, Validators.min(0.0001), Validators.max(10000)]]
    });

    this.converterForm = this.fb.group({
      amount: [100, [Validators.required, Validators.min(0.01)]],
      fromCurrency: ['USD', Validators.required],
      toCurrency: ['MAD', Validators.required]
    });
  }

  /**
   * Setup search functionality with debouncing
   */
  private setupSearchSubscription(): void {
    this.searchSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.applyFilter(searchTerm);
    });
  }

  /**
   * Setup custom filtering for the data source
   */
  private setupCustomFiltering(): void {
    this.dataSource.filterPredicate = (data: DeviseResponse, filter: string) => {
      const searchStr = filter.toLowerCase().trim();
      return data.code.toLowerCase().includes(searchStr) ||
        data.libelle.toLowerCase().includes(searchStr) ||
        data.tauxConversion.toString().includes(searchStr);
    };
  }

  /**
   * Load all currencies from the backend
   */
  loadDevises(): void {
    this.loading = true;
    this.deviseService.findAll()
      .pipe(
        catchError(error => {
          console.error('Error loading currencies:', error);
          this.showErrorMessage('Failed to load currencies. Using demo data.');
          return of(this.getMockDevises());
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(devises => {
        this.processDevisesData(devises);
        this.updateConverterCurrencies(devises);
      });
  }

  /**
   * Load statistics
   */
  private loadStatistics(): void {
    this.deviseService.getStatistics()
      .pipe(
        catchError(() => of(null)),
        takeUntil(this.destroy$)
      )
      .subscribe(stats => {
        this.statistics = stats;
        this.cdr.detectChanges();
      });
  }

  /**
   * Process loaded data
   */
  private processDevisesData(devises: DeviseResponse[]): void {
    this.dataSource.data = devises;
    this.filteredDevises$.next(devises);
    this.applyFilter(this.searchTerm);
  }

  /**
   * Update converter currency options
   */
  private updateConverterCurrencies(devises: DeviseResponse[]): void {
    const availableCurrencies = devises.map(d => d.code);
    if (!availableCurrencies.includes(this.converterForm.get('fromCurrency')?.value)) {
      this.converterForm.patchValue({ fromCurrency: availableCurrencies[0] || 'USD' });
    }
    if (!availableCurrencies.includes(this.converterForm.get('toCurrency')?.value)) {
      this.converterForm.patchValue({ toCurrency: availableCurrencies[1] || 'MAD' });
    }
  }

  /**
   * Search and filtering
   */
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject$.next(this.searchTerm);
  }

  applyFilter(searchTerm: string = this.searchTerm): void {
    this.dataSource.filter = searchTerm.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.searchSubject$.next('');
    this.applyFilter('');
  }

  /**
   * CRUD Operations
   */
  openAddDeviseForm(): void {
    this.isEditMode = false;
    this.editingDevise = null;
    this.deviseForm.reset();
    this.deviseForm.patchValue({
      tauxConversion: 1.0000
    });
    this.showForm = true;
  }

  openEditDeviseForm(devise: DeviseResponse): void {
    this.isEditMode = true;
    this.editingDevise = devise;
    this.deviseForm.patchValue({
      code: devise.code,
      libelle: devise.libelle,
      tauxConversion: devise.tauxConversion
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditMode = false;
    this.editingDevise = null;
    this.deviseForm.reset();
  }

  async saveDevise(): Promise<void> {
    if (this.deviseForm.invalid) {
      this.markFormGroupTouched(this.deviseForm);
      return;
    }

    const formValue = this.deviseForm.value;
    const deviseData: DeviseRequest = {
      code: formValue.code.toUpperCase(),
      libelle: formValue.libelle.trim(),
      tauxConversion: parseFloat(formValue.tauxConversion)
    };

    // Validate data
    const validationErrors = this.deviseService.validateDevise(deviseData);
    if (validationErrors.length > 0) {
      this.showErrorMessage(validationErrors.join(', '));
      return;
    }

    // Check for duplicate code (only for new currencies or when code changed)
    if (!this.isEditMode || (this.editingDevise && this.editingDevise.code !== deviseData.code)) {
      try {
        const codeExists = await this.deviseService.checkCodeExists(
          deviseData.code,
          this.editingDevise?.id
        ).toPromise();

        if (codeExists) {
          this.showErrorMessage(`Currency code '${deviseData.code}' already exists`);
          return;
        }
      } catch (error) {
        console.warn('Could not check code uniqueness:', error);
      }
    }

    this.saving = true;
    const operation = this.isEditMode
      ? this.deviseService.update(this.editingDevise!.id, deviseData)
      : this.deviseService.save(deviseData);

    operation.pipe(
      catchError(error => {
        this.showErrorMessage(
          this.isEditMode
            ? 'Failed to update currency'
            : 'Failed to create currency'
        );
        return of(null);
      }),
      finalize(() => {
        this.saving = false;
        this.cdr.detectChanges();
      }),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.showSuccessMessage(
          this.isEditMode
            ? 'Currency updated successfully'
            : 'Currency created successfully'
        );
        this.closeForm();
        this.loadDevises();
        this.loadStatistics();
      }
    });
  }

  deleteDevise(devise: DeviseResponse): void {
    // Prevent deletion of base currency
    if (devise.code === this.selectedBaseCurrency) {
      this.showErrorMessage(`Cannot delete the base currency (${this.selectedBaseCurrency})`);
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ${devise.libelle} (${devise.code})?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    this.deleting.add(devise.id);
    this.deviseService.delete(devise.id)
      .pipe(
        catchError(error => {
          this.showErrorMessage('Failed to delete currency');
          return of(null);
        }),
        finalize(() => {
          this.deleting.delete(devise.id);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        if (result !== null) {
          this.showSuccessMessage('Currency deleted successfully');
          this.loadDevises();
          this.loadStatistics();
        }
      });
  }

  /**
   * Currency conversion
   */
  toggleConverter(): void {
    this.showConverter = !this.showConverter;
    if (this.showConverter) {
      this.performConversion();
    }
  }

  performConversion(): void {
    if (this.converterForm.invalid) return;

    const { amount, fromCurrency, toCurrency } = this.converterForm.value;

    if (fromCurrency === toCurrency) {
      this.conversionResult = amount;
      return;
    }

    this.deviseService.convertCurrency(amount, fromCurrency, toCurrency)
      .pipe(
        catchError(() => {
          this.showErrorMessage('Conversion failed');
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        this.conversionResult = result;
        this.cdr.detectChanges();
      });
  }

  swapCurrencies(): void {
    const fromCurrency = this.converterForm.get('fromCurrency')?.value;
    const toCurrency = this.converterForm.get('toCurrency')?.value;

    this.converterForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency
    });

    this.performConversion();
  }

  /**
   * Rate refresh functionality
   */
  refreshRates(): void {
    this.refreshing = true;
    this.showInfoMessage('Refreshing exchange rates...');

    this.deviseService.refreshRates()
      .pipe(
        catchError(() => {
          this.showErrorMessage('Failed to refresh rates');
          return of([]);
        }),
        finalize(() => {
          this.refreshing = false;
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(updatedDevises => {
        if (updatedDevises.length > 0) {
          this.processDevisesData(updatedDevises);
          this.showSuccessMessage('Exchange rates updated successfully');
          this.loadStatistics();
        }
      });
  }

  /**
   * Utility methods
   */
  formatExchangeRate(rate: number): string {
    return rate.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });
  }

  formatCurrency(amount: number, currencyCode: string): string {
    return this.deviseService.formatAmount(amount, currencyCode);
  }

  getTimeSinceUpdate(): string {
    if (!this.statistics?.lastUpdate) return 'Never';

    const now = new Date();
    const diff = now.getTime() - this.statistics.lastUpdate.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  isDeleting(devise: DeviseResponse): boolean {
    return this.deleting.has(devise.id);
  }

  canDeleteDevise(devise: DeviseResponse): boolean {
    return devise.code !== this.selectedBaseCurrency;
  }

  isCurrencyDisabled(currency: string): boolean {
    return this.dataSource.data.some(d => d.code === currency);
  }

  selectPopularCurrency(currency: string): void {
    if (!this.isCurrencyDisabled(currency)) {
      this.deviseForm.patchValue({ code: currency });
    }
  }

  setConverterFromCurrency(code: string): void {
    this.converterForm.patchValue({ fromCurrency: code });
    this.showConverter = true;
    this.performConversion();
  }

  setConverterToCurrency(code: string): void {
    this.converterForm.patchValue({ toCurrency: code });
    this.showConverter = true;
    this.performConversion();
  }

  getFieldError(fieldName: string): string {
    const field = this.deviseForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['pattern']) return `${fieldName} must be 3 uppercase letters`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
      if (field.errors['max']) return `${fieldName} is too large`;
    }
    return '';
  }

  /**
   * Private helper methods
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfoMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }

  private getMockDevises(): DeviseResponse[] {
    return [
      { id: 1, code: 'USD', libelle: 'Dollar Américain', tauxConversion: 9.9500 },
      { id: 2, code: 'EUR', libelle: 'Euro', tauxConversion: 10.5000 },
      { id: 3, code: 'MAD', libelle: 'Dirham Marocain', tauxConversion: 1.0000 },
      { id: 4, code: 'GBP', libelle: 'Livre Sterling', tauxConversion: 12.3000 },
      { id: 5, code: 'JPY', libelle: 'Yen Japonais', tauxConversion: 0.0650 },
      { id: 6, code: 'CHF', libelle: 'Franc Suisse', tauxConversion: 11.2000 }
    ];
  }
}
