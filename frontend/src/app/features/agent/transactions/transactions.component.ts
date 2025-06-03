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



}
