import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

export const RedirectIfAuthenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) return true;

  try {
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded?.roles || [];

    if (roles.includes('ROLE_ADMIN')) {
      router.navigate(['/admin']).then(() => false);
    } else if (roles.includes('ROLE_USER')) {
      router.navigate(['/user-account']).then(() => false);
    } else if (roles.includes('ROLE_AGENT')) {
    router.navigate(['/agent-panel']).then(() => false);
  } else {
      router.navigate(['/']).then(() => false);
    }

    return false; // Interdit d’accéder à login/register si déjà connecté
  } catch (err) {
    console.warn('❌ Token invalide ou corrompu', err);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return true; // Peut accéder
  }
};
