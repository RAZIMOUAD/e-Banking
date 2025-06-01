import { Component } from '@angular/core';

@Component({
  selector: 'app-virement-extern',
  templateUrl: './virement-extern.component.html'
})
export class VirementExternComponent {
  compteSource = '';
  nomBeneficiaire = '';
  iban = '';
  swift = '';
  banque = '';
  montant = 0;
  motif = '';

  comptes = ['FR7630004000031234567890143', 'FR7630004000039876543210011']; // @TODO: Remplacer par appel API

  effectuerVirementExterne() {
    // @TODO: Appeler l'API de virement externe ici avec les infos du formulaire
    console.log('Virement externe envoyé', {
      compteSource: this.compteSource,
      nomBeneficiaire: this.nomBeneficiaire,
      iban: this.iban,
      swift: this.swift,
      banque: this.banque,
      montant: this.montant,
      motif: this.motif,
    });
  }
}
