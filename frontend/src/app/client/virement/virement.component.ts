import { Component, OnInit } from '@angular/core';
import { ServiceClientService } from '../service-client.service';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-virement',
  templateUrl: './virement.component.html',
  styleUrl: 'virement.component.css'
})
export class VirementComponent implements OnInit {
  comptes: any[] = [];
  compteSource: number | null = null;
  compteCible: number | null = null;
  montant = 0;
  motif = '';
  clientId = 36;

  constructor(private transactionService: ServiceClientService) {}

  ngOnInit() {
    this.transactionService.getComptes(this.clientId).subscribe(res => {
      this.comptes = res.comptes;
    });
  }

  effectuerVirement() {
    if (!this.compteSource || !this.compteCible || this.montant <= 0 || !this.motif) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const data = {
      sourceCompteId: this.compteSource,
      cibleCompteId: this.compteCible,
      montant: this.montant,
      motif: this.motif,
      mode: 'INTERNE'
    };

    //this.transactionService.effectuerVirement(data).subscribe({
    //   next: () => alert('Virement interne effectué avec succès'),
    //   error: err => alert('Erreur : ' + (err.error?.message || JSON.stringify(err)))
    // });
  }
}
