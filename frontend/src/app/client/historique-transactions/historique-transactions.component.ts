import { Component, OnInit } from '@angular/core';
import { ServiceClientService, TransactionResponseDTO } from '../service-client.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-historique-transactions',
  templateUrl: './historique-transactions.component.html'
})
export class HistoriqueTransactionsComponent implements OnInit {
  transactions: TransactionResponseDTO[] = [];
  compteId: number=2;

  constructor(
    private transactionService: ServiceClientService,
  ) {}

  ngOnInit(): void {
    this.transactionService.getTransactionsByCompte(this.compteId).subscribe({
      next: data => this.transactions = data,
      error: err => console.error('Erreur lors du chargement des transactions', err)
    });

  }


}
