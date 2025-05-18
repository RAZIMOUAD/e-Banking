import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

export const AuthGuardAdmin: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    router.navigate(['/login']).then(() => false);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded?.roles || [];

    if (roles.includes('ROLE_ADMIN')) {
      return true;
    }
  } catch (err) {
    console.warn('❌ Token invalide ou corrompu', err);
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  router.navigate(['/login']).then(() => false);
  return false;
};
