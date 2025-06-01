import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {map, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import {
  RegisterPayload,
  LoginPayload,
  AuthenticationResponse,
  DecodedToken
} from '@core/models/auth.model';
import { AUTH_TOKEN_KEY } from '@core/constants/storage-keys';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = AUTH_TOKEN_KEY;
  private readonly API_URL = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  register(data: RegisterPayload): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/register`, data)
      .pipe(catchError(err => this.handleError(err)));
  }

  verifyTwoFactorCode(payload: { email: string; code: string }): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/verify-2fa`, payload);
  }

  login(credentials: LoginPayload): Observable<AuthenticationResponse> {
    return this.http.post<any>(`${this.API_URL}/authenticate`, credentials).pipe(
      map(res => ({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        message: res.message,
        requires2FA: res.requires2FA,
      })),
      catchError(err => this.handleError(err))
    );
  }


  activateAccount(payload: { email: string; code: string }): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/activate`, payload)
      .pipe(catchError(err => this.handleError(err)));
  }

  handleLoginResponse(response: AuthenticationResponse): void {
    if (!response.accessToken) {
      console.error('❌ Token manquant dans la réponse d’authentification');
      return;
    }

    localStorage.setItem(this.tokenKey, response.accessToken);

    try {
      const decoded = jwtDecode<DecodedToken>(response.accessToken);
      const roles = this.extractRoles(decoded);

      console.log('🎫 Token décodé:', decoded);
      console.log('🎯 Rôles détectés:', roles);

      this.redirectBasedOnRoles(roles);
    } catch (error) {
      console.error('❌ Erreur de décodage JWT:', error);
    }
  }

  private redirectBasedOnRoles(roles: string[]): void {
    console.log('📦 Redirection en fonction des rôles :', roles);
    const path =
      roles.includes('ROLE_ADMIN') ? '/admin/dashboard' :
        roles.includes('ROLE_AGENT') ? '/agent/dashboard' :
          roles.includes('ROLE_CLIENT') ? '/client/dashboard' :
            '/';

    this.router.navigateByUrl(path);
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
    console.trace('🔒 Logout triggered');
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
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
