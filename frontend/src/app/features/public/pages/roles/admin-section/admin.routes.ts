import { Routes } from '@angular/router';
import { AdminSectionComponent } from './admin-section.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminSectionComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'agents',
        loadComponent: () =>
          import('./agents/agents.component').then(m => m.AgentsComponent)
      },
      {
        path: 'devises',
        loadComponent: () =>
          import('./devises/devises.component').then(m => m.DevisesComponent)
      },
      {
        path: 'parametres',
        loadComponent: () =>
          import('./parametres/parametres.component').then(m => m.ParametresComponent)
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('./logs/logs.component').then(m => m.LogsComponent)
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./audit/audit.component').then(m => m.AuditComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
