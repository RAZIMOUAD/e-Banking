import { Component } from '@angular/core';
import {BankingLucideIconsModule} from "@shared/modules/banking-lucide-icons.module";

@Component({
  selector: 'app-comparer-section',
  standalone: true,
  imports : [BankingLucideIconsModule],
  templateUrl: './comparer-section.component.html',
  styleUrls: ['./comparer-section.component.css']
})
export class ComparerSectionComponent {}
