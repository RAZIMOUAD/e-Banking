import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent {
  // Données du formulaire
  destinataire: string = '';
  montant: number | null = null;
  description: string = '';

  // Historique statique (à remplacer plus tard par appel API)
  historiquePaiements = [
    { destinataire: 'EDF', montant: 120.50, date: '2024-05-01', description: 'Facture électricité' },
    { destinataire: 'SFR', montant: 49.99, date: '2024-04-25', description: 'Abonnement téléphone' },
    { destinataire: 'Loyer', montant: 800.00, date: '2024-04-01', description: 'Loyer Avril' }
  ];

  // Méthode de validation (simulée)
  effectuerPaiement() {
    if (this.destinataire && this.montant && this.description) {
      const nouveauPaiement = {
        destinataire: this.destinataire,
        montant: this.montant,
        date: new Date().toISOString().slice(0, 10),
        description: this.description
      };
      this.historiquePaiements.unshift(nouveauPaiement); // Ajoute au début
      // Reset formulaire
      this.destinataire = '';
      this.montant = null;
      this.description = '';
      alert('Paiement effectué avec succès !');
    }
  }
}

