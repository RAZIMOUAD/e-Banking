// features/public/public.routes.ts
import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '../../layouts/public-layout/public-layout.component';

export const publicRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'features',
        loadComponent: () =>
          import('./pages/features/features.component').then(m => m.FeaturesComponent)
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/roles/roles.component').then(m => m.RolesComponent)
      }
    ]
  }
];
