import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {BankingLucideIconsModule} from "@shared/modules/banking-lucide-icons.module";

@Component({
  selector: 'app-client-section',
  standalone: true,
  imports: [NgOptimizedImage, BankingLucideIconsModule],
  templateUrl: './client-section.component.html',
  styleUrls: ['./client-section.component.css']
})
export class ClientSectionComponent {}
