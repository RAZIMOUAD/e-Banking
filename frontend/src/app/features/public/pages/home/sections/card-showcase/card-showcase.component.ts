// card-showcase.component.ts
import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-showcase',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './card-showcase.component.html',
  styleUrls: ['./card-showcase.component.css']
})
export class CardShowcaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardEl', { static: false }) cardEl!: ElementRef;
  @ViewChild('glowEffect', { static: false }) glowEffect!: ElementRef;

  // Animation signals
  cardRotationY = signal(0);
  cardRotationX = signal(0);
  isHovered = signal(false);
  animationFrame = signal(0);

  private animationId: number = 0;
  private mouseX = 0;
  private mouseY = 0;

  // Card features data
  cardFeatures = [
    {
      icon: 'contactless',
      title: 'Contactless Payments',
      description: 'Tap to pay anywhere with NFC technology',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'security',
      title: 'Advanced Security',
      description: 'Biometric authentication & fraud protection',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: 'global',
      title: 'Global Access',
      description: 'Use your card in 150+ countries worldwide',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: 'insights',
      title: 'Smart Insights',
      description: 'AI-powered spending analytics and recommendations',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  // Stats data
  cardStats = [
    { value: 0, target: 99.9, suffix: '%', label: 'Acceptance Rate' },
    { value: 0, target: 256, suffix: '-bit', label: 'Encryption' },
    { value: 0, target: 24, suffix: '/7', label: 'Support' },
    { value: 0, target: 0, suffix: '$', label: 'Annual Fee' }
  ];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.startCardAnimation();
    this.setupMouseTracking();
    this.animateStats();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private startCardAnimation(): void {
    let rotation = 0;
    const animate = () => {
      if (!this.isHovered()) {
        // Gentle floating animation when not hovered
        rotation += 0.5;
        const floatY = Math.sin(rotation * 0.02) * 10;
        const rotateY = Math.sin(rotation * 0.01) * 5;

        if (this.cardEl?.nativeElement) {
          this.renderer.setStyle(
            this.cardEl.nativeElement,
            'transform',
            `translateY(${floatY}px) rotateY(${rotateY}deg) rotateX(${Math.sin(rotation * 0.015) * 2}deg)`
          );
        }
      }

      this.animationFrame.set(rotation);
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private setupMouseTracking(): void {
    if (this.cardEl?.nativeElement) {
      const card = this.cardEl.nativeElement;

      card.addEventListener('mouseenter', () => {
        this.isHovered.set(true);
      });

      card.addEventListener('mouseleave', () => {
        this.isHovered.set(false);
        // Reset to neutral position
        this.renderer.setStyle(card, 'transform', 'rotateY(0deg) rotateX(0deg)');
      });

      card.addEventListener('mousemove', (e: MouseEvent) => {
        if (this.isHovered()) {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const rotateX = (e.clientY - centerY) / 10;
          const rotateY = (e.clientX - centerX) / 10;

          this.renderer.setStyle(
            card,
            'transform',
            `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
          );

          // Update glow effect position
          if (this.glowEffect?.nativeElement) {
            const glowX = ((e.clientX - rect.left) / rect.width) * 100;
            const glowY = ((e.clientY - rect.top) / rect.height) * 100;

            this.renderer.setStyle(
              this.glowEffect.nativeElement,
              'background',
              `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.3) 0%, transparent 70%)`
            );
          }
        }
      });
    }
  }

  private animateStats(): void {
    this.cardStats.forEach((stat, index) => {
      let current = 0;
      const increment = stat.target / 60; // 60 frames for 1 second animation

      const animateStat = () => {
        if (current < stat.target) {
          current += increment;
          stat.value = Math.min(current, stat.target);
          requestAnimationFrame(animateStat);
        } else {
          stat.value = stat.target;
        }
      };

      // Stagger the animations
      setTimeout(animateStat, index * 200);
    });
  }

  onCardClick(): void {
    // Add click animation or navigation
    console.log('Card clicked - could navigate to card management');
  }
}
