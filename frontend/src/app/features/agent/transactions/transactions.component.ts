import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from "@shared/components/navbar/navbar.component";
import {FooterComponent} from "@shared/components/footer/footer.component";
import {NgClass, NgFor} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {EspaceagentService} from "../../../services/espaceagent.service";

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    NgClass,
    NgFor,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{
  transactionservice =  inject(EspaceagentService)
  transactions:any[]=[];
  ngOnInit(): void {
    this.transactionservice.getAllTransactions().subscribe(data => {this.transactions = data} )
  }

  formatDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 3) return '';
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    return `${year}-${this.pad(month)}-${this.pad(day)} ${this.pad(hour)}:${this.pad(minute)}:00`;
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }
  confirmDelete(transactionId: number): void {
    console.log(transactionId)
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.transactionservice.deleteTransaction(transactionId).subscribe({
        next: () => {
          this.transactions = this.transactions.filter(client => client.id !== transactionId);
          console.log(this.transactions.length)
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
        }
      });
    }
  }


}
