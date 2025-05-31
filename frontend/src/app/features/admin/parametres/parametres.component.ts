import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { SettingsService, GlobalSettingsResponse, GlobalSettingsRequest } from '@core/services/settings.service';
import { DeviseService } from '@core/services/devise.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
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
export class ParametresComponent implements OnInit {
  systemForm!: FormGroup;
  securityForm!: FormGroup;
  notificationForm!: FormGroup;

  availableCurrencies: {code: string, name: string}[] = [];

  // Chargement des données
  loading = false;
  saving = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private deviseService: DeviseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadCurrencies();
    this.loadSettings();
  }

  initForms(): void {
    // System Settings Form
    this.systemForm = this.fb.group({
      defaultCurrency: ['USD', Validators.required],
      transactionFeePercentage: [1.5, [Validators.required, Validators.min(0), Validators.max(100)]],
      minimumTransactionFee: [0.50, [Validators.required, Validators.min(0)]],
      maximumTransactionFee: [100, [Validators.required, Validators.min(0)]],
      dailyTransactionLimit: [10000, [Validators.required, Validators.min(0)]],
      maintenanceMode: [false],
      supportEmail: ['support@ebanking.com', [Validators.required, Validators.email]],
      supportPhone: ['+1 (555) 123-4567', Validators.required],
      termsLastUpdated: [new Date()]
    });

    // Security Settings Form
    this.securityForm = this.fb.group({
      passwordExpiryDays: [90, [Validators.required, Validators.min(0)]],
      maxLoginAttempts: [5, [Validators.required, Validators.min(1)]],
      lockoutDurationMinutes: [30, [Validators.required, Validators.min(1)]],
      requireTwoFactor: [true],
      sessionTimeoutMinutes: [15, [Validators.required, Validators.min(1)]],
      allowedIpAddresses: ['']
    });

    // Notification Settings Form
    this.notificationForm = this.fb.group({
      enableEmailNotifications: [true],
      enableSmsNotifications: [true],
      enablePushNotifications: [true],
      transactionNotifications: [true],
      loginNotifications: [true],
      marketingNotifications: [false],
      systemNotifications: [true]
    });
  }

  loadCurrencies(): void {
    this.deviseService.findAll()
      .pipe(
        catchError(error => {
          console.error('Error loading currencies:', error);
          // Utiliser des données fictives si l'API n'est pas disponible
          return of(this.generateMockCurrencies());
        })
      )
      .subscribe(currencies => {
        this.availableCurrencies = currencies
          .filter(c => c.active) // Ne prendre que les devises actives
          .map(c => ({ code: c.code, name: c.name }));
      });
  }

  loadSettings(): void {
    this.loading = true;
    this.error = false;

    this.settingsService.getSettings()
      .pipe(
        catchError(error => {
          console.error('Error loading settings:', error);
          this.error = true;
          this.snackBar.open('Failed to load settings. Please try again.', 'Close', {
            duration: 5000
          });
          return of(this.generateMockSettings());
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(settings => {
        // Mettre à jour les formulaires avec les données de l'API
        this.updateFormsWithSettings(settings);
      });
  }

  updateFormsWithSettings(settings: GlobalSettingsResponse): void {
    // System Settings
    this.systemForm.patchValue({
      defaultCurrency: settings.defaultCurrency,
      transactionFeePercentage: settings.transactionFeePercentage,
      minimumTransactionFee: settings.minimumTransactionFee,
      maximumTransactionFee: settings.maximumTransactionFee,
      dailyTransactionLimit: settings.dailyTransactionLimit,
      maintenanceMode: settings.maintenanceMode,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      termsLastUpdated: settings.termsLastUpdated
    });

    // Security Settings
    this.securityForm.patchValue({
      passwordExpiryDays: settings.passwordExpiryDays,
      maxLoginAttempts: settings.maxLoginAttempts,
      lockoutDurationMinutes: settings.lockoutDurationMinutes,
      requireTwoFactor: settings.requireTwoFactor,
      sessionTimeoutMinutes: settings.sessionTimeoutMinutes
    });

    // Notification Settings
    this.notificationForm.patchValue({
      enableEmailNotifications: settings.enableEmailNotifications,
      enableSmsNotifications: settings.enableSmsNotifications,
      enablePushNotifications: settings.enablePushNotifications
    });
  }

  saveSystemSettings(): void {
    if (this.systemForm.invalid) {
      this.markFormGroupTouched(this.systemForm);
      return;
    }

    this.saving = true;

    // Préparer les données pour la mise à jour
    const settingsData: GlobalSettingsRequest = {
      ...this.generateMockSettings(), // Pour les champs qui ne sont pas dans ce formulaire
      ...this.systemForm.value
    };

    this.settingsService.updateSettings(settingsData)
      .pipe(
        catchError(error => {
          console.error('Error saving system settings:', error);
          this.snackBar.open('Failed to save settings. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        }),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.snackBar.open('System settings saved successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  saveSecuritySettings(): void {
    if (this.securityForm.invalid) {
      this.markFormGroupTouched(this.securityForm);
      return;
    }

    this.saving = true;

    // Préparer les données pour la mise à jour
    const settingsData: GlobalSettingsRequest = {
      ...this.generateMockSettings(), // Pour les champs qui ne sont pas dans ce formulaire
      ...this.securityForm.value
    };

    this.settingsService.updateSettings(settingsData)
      .pipe(
        catchError(error => {
          console.error('Error saving security settings:', error);
          this.snackBar.open('Failed to save settings. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        }),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.snackBar.open('Security settings saved successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  saveNotificationSettings(): void {
    if (this.notificationForm.invalid) {
      this.markFormGroupTouched(this.notificationForm);
      return;
    }

    this.saving = true;

    // Préparer les données pour la mise à jour
    const settingsData: GlobalSettingsRequest = {
      ...this.generateMockSettings(), // Pour les champs qui ne sont pas dans ce formulaire
      ...this.notificationForm.value
    };

    this.settingsService.updateSettings(settingsData)
      .pipe(
        catchError(error => {
          console.error('Error saving notification settings:', error);
          this.snackBar.open('Failed to save settings. Please try again.', 'Close', {
            duration: 5000
          });
          return of(null);
        }),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.snackBar.open('Notification settings saved successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  resetToDefaults(): void {
    // Show confirmation dialog
    const confirm = window.confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.');

    if (confirm) {
      this.initForms();
      this.snackBar.open('All settings have been reset to defaults', 'Close', {
        duration: 3000
      });
    }
  }

  // Génère des données fictives pour le formulaire
  generateMockSettings(): GlobalSettingsResponse {
    return {
      id: 1,
      defaultCurrency: 'USD',
      transactionFeePercentage: 1.5,
      minimumTransactionFee: 0.50,
      maximumTransactionFee: 100,
      dailyTransactionLimit: 10000,
      maintenanceMode: false,
      supportEmail: 'support@ebanking.com',
      supportPhone: '+1 (555) 123-4567',
      termsLastUpdated: new Date(),
      passwordExpiryDays: 90,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 30,
      requireTwoFactor: true,
      sessionTimeoutMinutes: 15,
      enableEmailNotifications: true,
      enableSmsNotifications: true,
      enablePushNotifications: true,
      lastUpdated: new Date()
    };
  }

  // Génère des devises fictives si l'API n'est pas disponible
  generateMockCurrencies(): any[] {
    return [
      { id: 1, code: 'USD', name: 'US Dollar', active: true },
      { id: 2, code: 'EUR', name: 'Euro', active: true },
      { id: 3, code: 'GBP', name: 'British Pound', active: true },
      { id: 4, code: 'JPY', name: 'Japanese Yen', active: true },
      { id: 5, code: 'CAD', name: 'Canadian Dollar', active: true }
    ];
  }
}
