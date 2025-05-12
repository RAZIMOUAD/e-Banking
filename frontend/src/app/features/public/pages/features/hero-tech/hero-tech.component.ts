import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BankingLucideIconsModule } from '@shared/modules/banking-lucide-icons.module';

@Component({
  selector: 'app-hero-tech-section',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterModule,
    BankingLucideIconsModule // ✅ contient toutes les icônes nécessaires
  ],
  templateUrl: './hero-tech.component.html',
  styleUrls: ['./hero-tech.component.css']
})
export class HeroTechSectionComponent {}
