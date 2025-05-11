import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BankingLucideIconsModule } from '@shared/modules/banking-lucide-icons.module';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, BankingLucideIconsModule ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {}
