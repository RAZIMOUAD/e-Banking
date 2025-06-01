import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import {
  RegisterPayload,
  LoginPayload,
  AuthenticationResponse,
  DecodedToken
} from '@core/models/auth.model';

@Injectable({ providedIn: 'root' }) // ✅ moderne, standalone-style pour service
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly API_URL = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  register(data: RegisterPayload): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/register`, data)
      .pipe(catchError(err => this.handleError(err)));
  }
  verifyTwoFactorCode(payload: { email: string; code: string }): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${this.API_URL}/verify-2fa`,
      payload
    );
  }

  login(credentials: LoginPayload): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/authenticate`, credentials)
      .pipe(catchError(err => this.handleError(err)));
  }

  activateAccount(payload: { email: string; code: string }): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/activate`, payload)
      .pipe(catchError(err => this.handleError(err)));
  }

  handleLoginResponse(response: AuthenticationResponse): void {
    if (!response.accessToken) {
      this.logout();
      return;
    }

    localStorage.setItem(this.tokenKey, response.accessToken);

    try {
      const decoded = jwtDecode<DecodedToken>(response.accessToken);
      this.redirectBasedOnRoles(this.extractRoles(decoded));
    } catch {
      this.logout();
    }
  }


  private redirectBasedOnRoles(roles: string[]): void {
    const path = roles.includes('ROLE_ADMIN') ? '/admin/dashboard' :
      roles.includes('ROLE_CLIENT') ? '/client/account' :
        roles.includes('ROLE_AGENT') ? '/agent/dashboard' : '/';
    this.router.navigate([path]).then(() => false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getEmail(): string | null {
    return this.getDecodedToken()?.email || null;
  }

  getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem(this.tokenKey);
    try {
      return token ? jwtDecode<DecodedToken>(token) : null;
    } catch {
      return null;
    }
  }

  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.roles ?? (decoded?.role ? [decoded.role] : []);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']).then(() => false);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let msg = 'Une erreur est survenue. Veuillez réessayer.';
    if ([400, 401].includes(error.status) && error.error?.includes('activé')) {
      msg = '⚠️ Votre compte n’est pas encore activé. Vérifiez votre email.';
    }
    return throwError(() => new Error(msg));
  }

  private extractRoles(decoded: DecodedToken): string[] {
    return decoded.roles || (decoded.role ? [decoded.role] : []);
  }


}
