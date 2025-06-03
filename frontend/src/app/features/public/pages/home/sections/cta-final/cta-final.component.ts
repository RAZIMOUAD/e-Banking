// cta-final.component.ts
import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-cta-final',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './cta-final.component.html',
  styleUrls: ['./cta-final.component.css']
})
export class CtaFinalComponent implements OnInit, OnDestroy {
  @ViewChild('countdownElement', { static: false }) countdownElement!: ElementRef;
  @ViewChild('floatingCard', { static: false }) floatingCard!: ElementRef;

  // Animation signals
  animatedUsers = signal(0);
  animatedSavings = signal(0);
  animatedTransactions = signal(0);
  timeLeft = signal({ hours: 23, minutes: 59, seconds: 59 });
  isCtaHovered = signal(false);
  floatingOffset = signal(0);

  private animationSubscriptions: Subscription[] = [];
  private countdownSubscription!: Subscription;

  // Trust indicators data
  trustIndicators = [
    {
      icon: 'shield',
      title: 'Bank-Level Security',
      description: '256-bit encryption & fraud protection',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: 'clock',
      title: 'Instant Setup',
      description: 'Account ready in under 3 minutes',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'globe',
      title: 'Global Access',
      description: 'Available in 150+ countries',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: 'support',
      title: '24/7 Support',
      description: 'Expert help whenever you need it',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  // Success stories data
  successStories = [
    {
      name: 'TechFlow Solutions',
      logo: 'techflow',
      savings: '40%',
      metric: 'transaction fees'
    },
    {
      name: 'Global Ventures',
      logo: 'global',
      savings: '60%',
      metric: 'processing time'
    },
    {
      name: 'StartupCorp',
      logo: 'startup',
      savings: '25%',
      metric: 'operational costs'
    }
  ];

  // Particle effects data
  particles = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 3
  }));

  ngOnInit(): void {
    this.startAnimations();
    this.startCountdown();
    this.startFloatingAnimation();
  }

  ngOnDestroy(): void {
    this.animationSubscriptions.forEach(sub => sub.unsubscribe());
    this.countdownSubscription?.unsubscribe();
  }

  private startAnimations(): void {
    // Animate user count
    this.animateValue(0, 50000, 2000, (value) => {
      this.animatedUsers.set(value);
    });

    // Animate savings amount
    setTimeout(() => {
      this.animateValue(0, 2500, 1800, (value) => {
        this.animatedSavings.set(value);
      });
    }, 500);

    // Animate transaction count
    setTimeout(() => {
      this.animateValue(0, 1000000, 2200, (value) => {
        this.animatedTransactions.set(value);
      });
    }, 1000);
  }

  private animateValue(start: number, end: number, duration: number, callback: (value: number) => void): void {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(start + (end - start) * easeOutCubic);

      callback(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  private startCountdown(): void {
    this.countdownSubscription = interval(1000).subscribe(() => {
      const current = this.timeLeft();
      let { hours, minutes, seconds } = current;

      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        seconds = 59;
        minutes--;
      } else if (hours > 0) {
        seconds = 59;
        minutes = 59;
        hours--;
      } else {
        // Reset countdown
        hours = 23;
        minutes = 59;
        seconds = 59;
      }

      this.timeLeft.set({ hours, minutes, seconds });
    });
  }

  private startFloatingAnimation(): void {
    let offset = 0;
    const animate = () => {
      offset += 0.02;
      this.floatingOffset.set(Math.sin(offset) * 10);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  }

  formatTime(time: number): string {
    return time.toString().padStart(2, '0');
  }

  onCtaHover(isHovered: boolean): void {
    this.isCtaHovered.set(isHovered);
  }

  onGetStartedClick(): void {
    // Add analytics tracking or additional logic here
    console.log('Get Started clicked - tracking user conversion');
  }

  onLearnMoreClick(): void {
    // Add analytics tracking or additional logic here
    console.log('Learn More clicked - tracking user interest');
  }
}
