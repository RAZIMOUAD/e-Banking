import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientRootComponent } from './client-root/client-root.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RechargeComponent } from './recharge/recharge.component';
import { VirementComponent } from './virement/virement.component';
import { VirementExternComponent } from './virement-extern/virement-extern.component';
import { HistoriqueTransactionsComponent } from './historique-transactions/historique-transactions.component';
import { ProfilClientComponent } from './profil-client/profil-client.component';
import { PaymentComponent} from "./payment/payment.component";

const routes: Routes = [
  {
    path: '',
    component: ClientRootComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'recharge', component: RechargeComponent },
      { path: 'virement', component: VirementComponent },
      { path: 'virement-extern', component: VirementExternComponent },
      { path: 'historique', component: HistoriqueTransactionsComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'profil', component: ProfilClientComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
