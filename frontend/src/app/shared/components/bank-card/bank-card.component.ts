import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { ScrollTransitionService } from '@shared/services/scroll-transition.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bank-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.css']
})
export class BankCardComponent implements OnInit, OnDestroy {
  scrollY = 0;
  private sub!: Subscription;

  constructor(private scroll: ScrollTransitionService) {}

  ngOnInit(): void {
    this.sub = this.scroll.getScrollY().subscribe(y => this.scrollY = y);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
