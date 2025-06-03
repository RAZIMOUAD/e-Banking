import { Component, OnInit } from '@angular/core';
import { ServiceClientService } from '../service-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-virement-extern',
  templateUrl: './virement-extern.component.html'
})
export class VirementExternComponent implements OnInit {
  typeCompte: string = '';
  nomBeneficiaire: string = '';
  iban: string = '';
  banque: string = '';
  montant = 0;
  motif = '';

  comptesDisponibles: any[] = []; // liste complète des comptes du client
  typesPossedes: string[] = [];   // liste des types de comptes (filtrés)

  clientId = 36; // À récupérer dynamiquement

  constructor(
    private clientService: ServiceClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clientService.getComptes(this.clientId).subscribe(res => {
      this.comptesDisponibles = res.comptes || [];

      // On filtre les types de compte sans doublons
      this.typesPossedes = [...new Set(this.comptesDisponibles.map(c => c.type))];
    });
  }

  effectuerVirementExterne() {
    if (!this.typeCompte || !this.iban || !this.nomBeneficiaire) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const virementData = {
      typeCompte: this.typeCompte,
      nomBeneficiaire: this.nomBeneficiaire,
      iban: this.iban,
      banque: this.banque,
      montant: this.montant,
      motif: this.motif,
      type: 'EXTERNE' // utilisé pour distinguer dans le backend
    };

    this.clientService.effectuerVirementExterne(virementData).subscribe({
      next: res => {
        alert('Virement externe effectué avec succès.');
        this.router.navigate(['/historique-virements']);
      },
      error: err => {
        console.error('Erreur lors du virement externe', err);
        alert('Erreur lors du virement externe.');
      }
    });
  }
}
