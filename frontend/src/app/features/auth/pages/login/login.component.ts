import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthenticationResponse } from '@core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }
  ],
  templateUrl: './login.component.html',
})

export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  requires2FA = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      code: [''] // Champ 2FA facultatif
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const { email, password, code } = this.loginForm.value;

    // Étape 1 : si 2FA est requis, on vérifie le code
    if (this.requires2FA) {
      this.authService.verifyTwoFactorCode({ email, code }).subscribe({
        next: (response: AuthenticationResponse) => {
          this.handleAuthSuccess(response);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Code invalide ou expiré';
        }
      });
      return;
    }

    // Étape 2 : tentative de connexion normale
    this.authService.login({ email, password }).subscribe({
      next: (response: AuthenticationResponse) => {
        if (response.requires2FA) {
          this.requires2FA = true;
          this.loading = false;
          return;
        }
        this.handleAuthSuccess(response);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Identifiants invalides. Veuillez réessayer.';
      },
    });
  }

  private handleAuthSuccess(response: AuthenticationResponse): void {
    this.authService.handleLoginResponse(response);
    const decoded = this.jwtHelper.decodeToken(response.accessToken ?? '');
    const roles = decoded?.roles || [decoded?.role];

    if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin']).then(() => false);
    } else if (roles.includes('ROLE_AGENT')) {
      this.router.navigate(['/agent']).then(() => false);
    } else {
      this.router.navigate(['/client']).then(() => false);
    }

    this.loading = false;
  }
}
