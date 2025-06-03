// partner-carousel.component.ts
import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-partner-carousel',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './partner-carousel.component.html',
  styleUrls: ['./partner-carousel.component.css']
})
export class PartnerCarouselComponent implements OnInit, OnDestroy {
  @ViewChild('marqueeContainer', { static: false }) marqueeContainer!: ElementRef;

  // Animation signals
  isHovered = signal(false);
  animationSpeed = signal(1);
  currentSlide = signal(0);

  // Partner data with enhanced information
  partners = [
    {
      name: 'Visa',
      logo: 'assets/hero/logos/visa.svg',
      category: 'Payment Network',
      description: 'Global payment processing',
      users: '3.5B+'
    },
    {
      name: 'Mastercard',
      logo: 'assets/hero/logos/mastercard.svg',
      category: 'Payment Network',
      description: 'Worldwide payment solutions',
      users: '2.8B+'
    },

    {
      name: 'Wise',
      logo: 'assets/hero/logos/wise.svg',
      category: 'International Transfers',
      description: 'Multi-currency banking',
      users: '13M+ customers'
    },
    {
      name: 'Revolut',
      logo: 'assets/hero/logos/revolut.svg',
      category: 'Digital Banking',
      description: 'Modern financial services',
      users: '25M+ users'
    },
    {
      name: 'N26',
      logo: 'assets/hero/logos/n26.svg',
      category: 'Digital Banking',
      description: 'Mobile-first banking',
      users: '8M+ customers'
    },
    {
      name: 'Monzo',
      logo: 'assets/hero/logos/monzo.svg',
      category: 'Digital Banking',
      description: 'Smart money management',
      users: '5M+ users'
    },
    {
      name: 'Binance',
      logo: 'assets/hero/logos/binance.svg',
      category: 'Cryptocurrency',
      description: 'Digital asset exchange',
      users: '120M+ traders'
    }
  ];

  // Trust metrics
  trustMetrics = [
    {
      value: 0,
      target: 99.9,
      suffix: '%',
      label: 'Uptime Guarantee',
      icon: 'shield'
    },
    {
      value: 0,
      target: 150,
      suffix: '+',
      label: 'Countries Supported',
      icon: 'globe'
    },
    {
      value: 0,
      target: 50,
      suffix: 'M+',
      label: 'Transactions Daily',
      icon: 'trending-up'
    },
    {
      value: 0,
      target: 24,
      suffix: '/7',
      label: 'Support Available',
      icon: 'headphones'
    }
  ];

  // Floating elements for background
  floatingElements = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 2,
    size: 20 + Math.random() * 40
  }));

  private animationId: number = 0;

  ngOnInit(): void {
    this.startAnimations();
    this.animateMetrics();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private startAnimations(): void {
    // Start floating animation for background elements
    let frame = 0;
    const animate = () => {
      frame += 0.01;
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private animateMetrics(): void {
    this.trustMetrics.forEach((metric, index) => {
      let current = 0;
      const increment = metric.target / 60; // 60 frames for 1 second

      const animateMetric = () => {
        if (current < metric.target) {
          current += increment;
          metric.value = Math.min(current, metric.target);
          requestAnimationFrame(animateMetric);
        } else {
          metric.value = metric.target;
        }
      };

      // Stagger animations
      setTimeout(animateMetric, index * 300);
    });
  }

  onMarqueeHover(isHovered: boolean): void {
    this.isHovered.set(isHovered);
    this.animationSpeed.set(isHovered ? 0.3 : 1);
  }

  selectPartner(index: number): void {
    this.currentSlide.set(index);
  }

  formatMetricValue(metric: any): string {
    if (metric.suffix === 'M+') {
      return (metric.value / 1000000).toFixed(0);
    } else if (metric.suffix === '+') {
      return Math.floor(metric.value).toString();
    } else if (metric.suffix === '%') {
      return metric.value.toFixed(1);
    } else if (metric.suffix === '/7') {
      return Math.floor(metric.value).toString();
    }
    return Math.floor(metric.value).toString();
  }

  getPartnersByCategory(category: string) {
    return this.partners.filter(partner => partner.category === category);
  }

  getAllCategories(): string[] {
    return [...new Set(this.partners.map(partner => partner.category))];
  }
}
