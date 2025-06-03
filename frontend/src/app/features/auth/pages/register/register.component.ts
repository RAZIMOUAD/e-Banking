import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { RegisterPayload } from '@core/models/auth.model';
import { REGISTER_STEPS, RegisterStep } from './register.steps';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RegisterCardComponent } from '@features/auth/pages/components/register-card/register-card.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RegisterCardComponent,
    RouterModule,
  ],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  activationForm: FormGroup;
  loading = false;
  errorMessage = '';
  activationError = '';
  currentStep = 0;
  showActivation = false;
  registeredEmail = '';
  steps: RegisterStep[] = REGISTER_STEPS;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: [''],
      genre: [''],
      nationalite: [''],
      numTel: [''],
      adresse: [''],
      cin: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.activationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    });
  }

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    const currentFields = this.steps[this.currentStep].fields;
    return currentFields.every((field) => this.registerForm.get(field)?.valid);
  }

  isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const formValue = this.registerForm.value;
    const payload: RegisterPayload = {
      nom: formValue['nom'],
      prenom: formValue['prenom'],
      dateNaissance: formValue['dateNaissance'] ?? null,
      genre: formValue['genre'] ?? '',
      nationalite: formValue['nationalite'] ?? '',
      numTel: formValue['numTel'] ?? '',
      adresse: formValue['adresse'] ?? '',
      cin: formValue['cin'] ?? '',
      email: formValue['email'],
      password: formValue['password'],
    };

    this.loading = true;
    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('✅ Inscription réussie :', res);
        this.registeredEmail = payload.email;
        this.showActivation = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur d\'inscription :', err);
        this.errorMessage = err.message || "Erreur lors de l'inscription";
        this.loading = false;
      },
    });
  }

  onActivate(): void {
    if (this.activationForm.invalid) return;
    this.loading = true;
    this.activationError = '';

    const payload = {
      email: this.registeredEmail,
      code: this.activationForm.value.code,
    };

    this.authService.activateAccount(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error('🛑 Erreur backend :', err);
        this.activationError = JSON.stringify(err.error) || 'Code invalide ou expiré';
      },
    });
  }

  get livePreviewData() {
    return this.registerForm.value;
  }

  // Helper methods for the enhanced UI
  getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      nom: 'Nom de famille',
      prenom: 'Prénom',
      dateNaissance: 'Date de naissance',
      genre: 'Genre',
      nationalite: 'Nationalité',
      numTel: 'Numéro de téléphone',
      adresse: 'Adresse complète',
      cin: 'Carte d\'identité nationale',
      email: 'Adresse e-mail',
      password: 'Mot de passe'
    };
    return labels[field] || field;
  }

  getFieldPlaceholder(field: string): string {
    const placeholders: { [key: string]: string } = {
      nom: 'Entrez votre nom',
      prenom: 'Entrez votre prénom',
      dateNaissance: '',
      genre: 'Sélectionnez votre genre',
      nationalite: 'Votre nationalité',
      numTel: '+212 6 00 00 00 00',
      adresse: 'Rue, ville, code postal',
      cin: 'Numéro CIN',
      email: 'exemple@email.com',
      password: 'Créez un mot de passe sécurisé'
    };
    return placeholders[field] || '';
  }

  getFieldType(field: string): string {
    switch (field) {
      case 'email': return 'email';
      case 'password': return 'password';
      case 'dateNaissance': return 'date';
      case 'numTel': return 'tel';
      default: return 'text';
    }
  }

  isFieldRequired(field: string): boolean {
    const requiredFields = ['nom', 'prenom', 'email', 'password'];
    return requiredFields.includes(field);
  }

  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.errors && control?.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(field)} est requis`;
      }
      if (control.errors['email']) {
        return 'Format d\'email invalide';
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `Minimum ${requiredLength} caractères requis`;
      }
      if (control.errors['pattern']) {
        switch (field) {
          case 'numTel':
            return 'Format de téléphone invalide';
          case 'cin':
            return 'Format CIN invalide';
          default:
            return 'Format invalide';
        }
      }
    }
    return '';
  }
}
