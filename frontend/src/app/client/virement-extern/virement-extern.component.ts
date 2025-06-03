import { Component, OnInit } from '@angular/core';
import { ServiceClientService } from '../service-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-virement-extern',
  templateUrl: './virement-extern.component.html'
})
export class VirementExternComponent implements OnInit {
  compteSourceId: number | null = null;
  nomBeneficiaire: string = '';
  ibanBeneficiaire: string = '';
  banque: string = '';
  montant = 0;
  motif = '';

  comptesDisponibles: any[] = [];
  banquesDisponibles: string[] = [
    'Attijariwafa Bank',
    'Banque Populaire',
    'BMCE Bank',
    'CIH',
    'Crédit Agricole du Maroc',
    'Société Générale Maroc',
    'BMCI',
    'CFG Bank',
    'Al Barid Bank'
  ];

  clientId = 36;

  constructor(
    private clientService: ServiceClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clientService.getComptes(this.clientId).subscribe(res => {
      this.comptesDisponibles = res.comptes || [];
    });
  }

  effectuerVirementExterne() {
    if (!this.compteSourceId || !this.ibanBeneficiaire || !this.nomBeneficiaire || !this.banque) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const virementData = {
      sourceCompteId: this.compteSourceId,
      montant: this.montant,
      motif: this.motif,
      mode: 'EXTERNE',
      nomBanque: this.banque,
      nomBeneficiaire: this.nomBeneficiaire,
      iban: this.ibanBeneficiaire
    };

    this.clientService.effectuerVirement(virementData).subscribe({
      next: () => {
        alert('Virement externe effectué avec succès.');
        this.router.navigate(['/historique']);
      },
      error: err => {
        console.error('Erreur détaillée :', err);
        alert('Erreur : ' + (err.error?.message || JSON.stringify(err)));
      }
    });
  }
}
