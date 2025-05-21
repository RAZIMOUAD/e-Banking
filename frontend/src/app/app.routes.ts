import { Routes } from '@angular/router';
import { publicRoutes } from '@features/public/public.routes';
import { adminRoutes } from '@features/public/pages/roles/admin-section/admin.routes';

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
