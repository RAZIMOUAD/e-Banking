import { Routes } from '@angular/router';
import { AdminSectionComponent } from './admin-section.component';
import { AuthGuardAdmin } from '@core/guards/auth.guard-admin';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminSectionComponent,
    canActivate: [AuthGuardAdmin],
    data: {
      title: 'Admin Portal',
      breadcrumb: 'Admin'
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
        data: {
          title: 'Dashboard',
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: 'agents',
        loadComponent: () => import('./agents/agents.component').then(c => c.AgentsComponent),
        data: {
          title: 'Agent Management',
          breadcrumb: 'Agents'
        }
      },
      {
        path: 'devises',
        loadComponent: () => import('./devises/devises.component').then(c => c.DevisesComponent),
        data: {
          title: 'Currency Management',
          breadcrumb: 'Currencies'
        }
      },
      {
        path: 'audit',
        loadComponent: () => import('./audit/audit.component').then(c => c.AuditComponent),
        data: {
          title: 'Audit Logs',
          breadcrumb: 'Audit'
        }
      },
      {
        path: 'parametres',
        loadComponent: () => import('./parametres/parametres.component').then(c => c.ParametresComponent),
        data: {
          title: 'System Parameters',
          breadcrumb: 'Settings'
        }
      },
      {
        path: 'logs',
        loadComponent: () => import('./logs/logs.component').then(c => c.LogsComponent),
        data: {
          title: 'System Logs',
          breadcrumb: 'Logs'
        }
      },

      {
        path: 'account-settings',
        loadComponent: () => import('./parametres/parametres.component').then(c => c.ParametresComponent),
        data: {
          title: 'Account Settings',
          breadcrumb: 'Account Settings'
        }
      },

      // Catch-all route for 404 within admin
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];
