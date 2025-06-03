import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Composants du module client
import { ClientRootComponent } from './client-root/client-root.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RechargeComponent } from './recharge/recharge.component';
import { VirementComponent } from './virement/virement.component';
import { VirementExternComponent } from './virement-extern/virement-extern.component';
import { HistoriqueTransactionsComponent } from './historique-transactions/historique-transactions.component';
import { ProfilClientComponent } from './profil-client/profil-client.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PaymentComponent } from './payment/payment.component';
import { NgChartsModule } from 'ng2-charts';

import { ClientRoutingModule } from './client-routing.module';

@NgModule({
  declarations: [
    ClientRootComponent,
    DashboardComponent,
    RechargeComponent,
    VirementComponent,
    VirementExternComponent,
    HistoriqueTransactionsComponent,
    ProfilClientComponent,
    NavbarComponent,
    SidebarComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    HttpClientModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
