import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthService } from '@core/services/auth.service';
import { AuthenticationResponse } from '@core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }
  ]
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
      code: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const { email, password, code } = this.loginForm.value;

    if (this.requires2FA) {
      this.authService.verifyTwoFactorCode({ email, code: code.trim() }).subscribe({
        next: (res) => this.handleAuthSuccess(res),
        error: (err) => this.handleError(err, 'Code invalide ou expiré')
      });
      return;
    }

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        if (res.requires2FA) {
          this.requires2FA = true;
          this.loginForm.get('code')?.reset();
          this.loading = false;
        } else {
          this.handleAuthSuccess(res);
        }
      },
      error: (err) => this.handleError(err, 'Identifiants invalides. Veuillez réessayer.')
    });
  }

  private handleAuthSuccess(response: AuthenticationResponse): void {
    this.authService.handleLoginResponse(response);

    const token = response.accessToken ?? '';
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      console.debug('✅ JWT décodé :', decoded);
    } catch (err) {
      console.error('❌ Erreur de décodage du token', err);
      // ❌ PAS DE REDIRECTION vers /login ici
    }

    this.loading = false;
  }

  private handleError(error: any, fallbackMessage: string): void {
    this.loading = false;
    this.errorMessage = error?.error?.message || fallbackMessage;
    console.error('❌ Auth Error :', this.errorMessage, error);
  }
}
