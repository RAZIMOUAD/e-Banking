import { Routes } from '@angular/router';
import { publicRoutes } from '@features/public/public.routes';
// Changez cette importation pour pointer vers le nouvel emplacement
import { adminRoutes } from '@features/admin/admin.routes';

export const routes: Routes = [
  ...publicRoutes,
  {
    path: 'admin',
    children: adminRoutes
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  }
];
