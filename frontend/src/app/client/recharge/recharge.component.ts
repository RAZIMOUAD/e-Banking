import { Component } from '@angular/core';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html'
})
export class RechargeComponent {
  type = '';
  montant = 0;
  numero = '';
  operateur = '';

  effectuerRecharge() {
    // TODO: appeler le backend pour la recharge
    console.log(`Recharge ${this.type} pour ${this.numero} de ${this.montant}€`);
  }
}
