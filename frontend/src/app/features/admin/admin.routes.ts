import { Routes } from '@angular/router';
import { AdminSectionComponent } from './admin-section.component';
import { AuthGuardAdmin } from '@core/guards/auth.guard-admin';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminSectionComponent,
    canActivate: [AuthGuardAdmin],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
      { path: 'agents', loadComponent: () => import('./agents/agents.component').then(c => c.AgentsComponent) },
      { path: 'devises', loadComponent: () => import('./devises/devises.component').then(c => c.DevisesComponent) },
      { path: 'audit', loadComponent: () => import('./audit/audit.component').then(c => c.AuditComponent) },
      { path: 'parametres', loadComponent: () => import('./parametres/parametres.component').then(c => c.ParametresComponent) },
      { path: 'logs', loadComponent: () => import('./logs/logs.component').then(c => c.LogsComponent) }
    ]
  }
];

