// app.routes.ts
import { Routes } from '@angular/router';
import { publicRoutes } from '@features/public/public.routes';

export const routes: Routes = [
  ...publicRoutes,
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  }

];


