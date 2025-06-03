// app.routes.ts
import { Routes } from '@angular/router';
import { publicRoutes } from '@features/public/public.routes';

export const routes: Routes = [
  ...publicRoutes,
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'client',
    loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@features/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'agent',
    loadChildren: () => import('@features/agent/agent.module').then(m => m.AgentModule)
  }

];


