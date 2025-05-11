import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollTransitionService} from "@shared/services/scroll-transition.service";
import { Subscription } from 'rxjs';
import {BankCardComponent} from "@shared/components/bank-card/bank-card.component";
import{FeatureCardComponent} from "@shared/components/feature-card/feature-card.component";

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule,RouterModule,NgOptimizedImage,FeatureCardComponent,BankCardComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  scrollY = signal(0);
  isScrolled = computed(() => this.scrollY() > 250);
  private scrollSub!: Subscription;

  constructor(private scrollService: ScrollTransitionService) {}

  ngOnInit(): void {
    this.scrollSub = this.scrollService.getScrollY().subscribe(y => this.scrollY.set(y));
  }

  ngOnDestroy(): void {
    this.scrollSub.unsubscribe();
  }

  get showView1(): boolean {
    return !this.isScrolled();
  }

  get showView2(): boolean {
    return this.isScrolled();
  }
}

