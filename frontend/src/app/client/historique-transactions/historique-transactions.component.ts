import { Component } from '@angular/core';

@Component({
  selector: 'app-historique-transactions',
  templateUrl: './historique-transactions.component.html'
})
export class HistoriqueTransactionsComponent {
  // TODO: appeler une API pour récupérer les vraies transactions
  transactions = [
    { date: '2025-05-20', libelle: 'Achat Amazon', montant: -89.90 },
    { date: '2025-05-18', libelle: 'Salaire', montant: 2500.00 },
    { date: '2025-05-17', libelle: 'Virement vers Jean Dupont', montant: -150.00 }
  ];
}
