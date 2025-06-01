import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {HeroSectionComponent} from '@features/public/pages/home/sections/hero-section/hero-section.component';
import{ PartnerCarouselComponent } from '@features/public/pages/home/sections/partner-carousel/partner-carousel.component';
import {CardShowcaseComponent} from '@features/public/pages/home/sections/card-showcase/card-showcase.component';
import {FaqSectionComponent} from '@features/public/pages/home/sections/faq-section/faq-section.component';
import {CtaFinalComponent} from "@features/public/pages/home/sections/cta-final/cta-final.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    HeroSectionComponent,
    PartnerCarouselComponent,
    CardShowcaseComponent,
    FaqSectionComponent,
    CtaFinalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent {

}
