import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';
export const AuthGuardAdmin: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  console.log('🛡️ Guard Admin - Token trouvé:', token);

  if (!token) {
    console.warn('❌ Aucun token trouvé. Redirection vers /login dans 2s...');
    setTimeout(() => router.navigate(['/login']), 2000);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded?.roles || (decoded?.role ? [decoded.role] : []);

    console.log('🧠 JWT décodé dans Guard:', decoded);
    console.log('🧾 Rôles extraits dans Guard:', roles);

    if (roles.includes('ROLE_ADMIN')) {
      console.log('✅ Accès autorisé à l’espace admin');
      return true;
    } else {
      console.warn('⛔ Rôle insuffisant. Redirection vers / dans 2s...');
      setTimeout(() => router.navigate(['/']), 2000);
      return false;
    }
  } catch (err) {
    console.error('❌ Erreur de décodage du JWT dans guard:', err);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setTimeout(() => router.navigate(['/login']), 2000);
    return false;
  }
};
