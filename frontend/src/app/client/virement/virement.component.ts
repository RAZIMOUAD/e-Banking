import { Component } from '@angular/core';

@Component({
  selector: 'app-virement',
  templateUrl: './virement.component.html'
})
export class VirementComponent {
  // TODO: récupérer depuis le backend la liste des comptes pour le virement
  comptes = ['Compte Courant', 'Compte Épargne'];
  destinataire: string = '';
  montant: number = 0;
  compteSource: string = '';
  motif: string ='';

  effectuerVirement() {
    // TODO: appeler l’API du backend pour effectuer le virement
    console.log('Virement simulé:', this.montant, 'vers', this.destinataire);
  }
}
