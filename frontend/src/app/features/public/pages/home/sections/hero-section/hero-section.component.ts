// hero-section.component.ts
import { Component, computed, OnDestroy, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage
  ],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  scrollY = signal(0);
  typedText = signal('');
  showCursor = signal(true);
  animatedBalance = signal('0');
  animatedUserCount = signal('0');
  isPlayingDemo = signal(false);

  private scrollSub!: Subscription;
  private typingSub!: Subscription;
  private balanceSub!: Subscription;
  private userCountSub!: Subscription;

  // Animation data
  particles = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 4
  }));

  quickActions = [
    { icon: 'send', label: 'Send' },
    { icon: 'receipt', label: 'Pay' },
    { icon: 'piggy-bank', label: 'Save' },
    { icon: 'bar-chart-2', label: 'Invest' }
  ];

  private readonly words = ['Reimagined', 'Simplified', 'Secured', 'Personalized'];
  private currentWordIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;

  ngOnInit(): void {
    // Initialize scroll tracking
    this.initializeScrollTracking();

    // Initialize typing animation
    this.startTypingAnimation();

    // Initialize balance animation
    this.animateBalance();

    // Initialize user count animation
    this.animateUserCount();

    // Cursor blinking
    interval(500).subscribe(() => this.showCursor.update(v => !v));
  }

  ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
    this.typingSub?.unsubscribe();
    this.balanceSub?.unsubscribe();
    this.userCountSub?.unsubscribe();
  }

  private initializeScrollTracking(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrollY.set(window.pageYOffset);
      });
    }
  }

  private startTypingAnimation(): void {
    this.typingSub = interval(100).subscribe(() => {
      const currentWord = this.words[this.currentWordIndex];

      if (!this.isDeleting) {
        // Typing
        if (this.currentCharIndex < currentWord.length) {
          this.typedText.set(currentWord.substring(0, this.currentCharIndex + 1));
          this.currentCharIndex++;
        } else {
          // Wait before deleting
          setTimeout(() => this.isDeleting = true, 2000);
        }
      } else {
        // Deleting
        if (this.currentCharIndex > 0) {
          this.typedText.set(currentWord.substring(0, this.currentCharIndex - 1));
          this.currentCharIndex--;
        } else {
          this.isDeleting = false;
          this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        }
      }
    });
  }

  private animateBalance(): void {
    const targetBalance = 247853;
    const duration = 2000;
    const steps = 60;
    const increment = targetBalance / steps;
    let current = 0;

    this.balanceSub = interval(duration / steps).subscribe(() => {
      if (current < targetBalance) {
        current += increment;
        this.animatedBalance.set(this.formatNumber(Math.floor(current)));
      }
    });
  }

  private animateUserCount(): void {
    const targetCount = 50000;
    const duration = 2500;
    const steps = 50;
    const increment = targetCount / steps;
    let current = 0;

    this.userCountSub = interval(duration / steps).subscribe(() => {
      if (current < targetCount) {
        current += increment;
        this.animatedUserCount.set(this.formatNumber(Math.floor(current)));
      }
    });
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }

  getCurrentUser(): string {
    return 'Sarah Johnson'; // This would come from auth service
  }

  playDemo(): void {
    this.isPlayingDemo.set(true);
    // Simulate demo playing
    setTimeout(() => this.isPlayingDemo.set(false), 3000);
  }
}
