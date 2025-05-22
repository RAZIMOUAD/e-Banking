import { Routes } from '@angular/router';
import { publicRoutes } from '@features/public/public.routes';

export const routes: Routes = [
  ...publicRoutes,
  {
    path: 'admin',
    loadChildren: () =>
      import('@features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];


