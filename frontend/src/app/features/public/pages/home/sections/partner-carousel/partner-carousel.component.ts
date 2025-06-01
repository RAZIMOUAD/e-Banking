import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-partner-carousel',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './partner-carousel.component.html',
  styleUrls: ['./partner-carousel.component.css']
})
export class PartnerCarouselComponent {
  logos = [
    'assets/hero/logos/binance.svg',
    'assets/hero/logos/revolut.svg',
    'assets/hero/logos/monzo.svg',
    'assets/hero/logos/n26.svg',
    'assets/hero/logos/wise.svg',
    'assets/hero/logos/stripe.svg',
    'assets/hero/logos/visa.svg',
    'assets/hero/logos/mastercard.svg',
  ];
}
