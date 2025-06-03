import { Component, OnInit } from '@angular/core';
import { ServiceClientService } from '../service-client.service';

@Component({
  selector: 'app-virement',
  templateUrl: './virement.component.html'
})
export class VirementComponent implements OnInit {
  comptes: any[] = [];
  compteSource = '';
  compteCible = '';
  montant = 0;
  motif = '';
  clientId = 36; // dynamiquement plus tard

  constructor(private transactionService: ServiceClientService) {}

  ngOnInit() {
    this.transactionService.getComptes(this.clientId).subscribe(res => {
      this.comptes = res.comptes;
    });
  }

  effectuerVirement() {
    const data = {
      sourceCompteId: this.compteSource,
      cibleCompteId: this.compteCible,
      montant: this.montant,
      motif: this.motif,
      mode: 'INTERNE'
    };

    this.transactionService.effectuerVirement(data).subscribe({
      next: () => alert('Virement interne effectué avec succès'),
      error: err => alert('Erreur : ' + err.error)
    });
  }
}
