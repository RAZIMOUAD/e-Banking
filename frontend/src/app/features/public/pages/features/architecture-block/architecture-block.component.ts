import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { BankingLucideIconsModule } from '@shared/modules/banking-lucide-icons.module';

@Component({
  selector: 'app-architecture-block',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, BankingLucideIconsModule],
  templateUrl: './architecture-block.component.html'
})
export class ArchitectureBlockComponent {}
