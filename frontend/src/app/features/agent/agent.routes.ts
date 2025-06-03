// agent.routes.ts
import { Routes } from '@angular/router';
import { AgentSectionComponent } from './agent-section.component';
import { AuthGuardAgent } from '@core/guards/auth.guard-agent';

export const agentRoutes: Routes = [
  {
    path: '',
    component: AgentSectionComponent,
    canActivate: [AuthGuardAgent],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashbord/dashbord.component').then(c => c.DashbordComponent) },
      { path: 'transactions', loadComponent: () => import('./transactions/transactions.component').then(c => c.TransactionsComponent) },
      { path: 'enrolement', loadComponent: () => import('./enrolement/enrolement.component').then(c => c.EnrolementComponent) }
    ]
  }
];
