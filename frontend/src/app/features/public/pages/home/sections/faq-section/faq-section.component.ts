// faq-section.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.css']
})
export class FaqSectionComponent implements OnInit {
  selectedIndex = signal(0);
  selectedCategory = signal('getting-started');
  isTransitioning = signal(false);

  // Enhanced FAQ data with categories and more details
  faqCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: 'user-plus',
      color: 'emerald'
    },
    {
      id: 'pricing',
      name: 'Pricing & Plans',
      icon: 'credit-card',
      color: 'blue'
    },
    {
      id: 'security',
      name: 'Security',
      icon: 'shield',
      color: 'purple'
    },
    {
      id: 'features',
      name: 'Features',
      icon: 'zap',
      color: 'orange'
    }
  ];

  faqData = {
    'getting-started': [
      {
        question: 'How to open a business account?',
        subtitle: 'Get started in under 3 minutes',
        answer: 'Opening your business account is simple: 1) Complete our online application, 2) Upload your business documents, 3) Verify your identity with our secure process, 4) Receive your IBAN and start banking immediately. Our streamlined process ensures you\'re up and running quickly.',
        image: 'assets/hero/faq/faq-1.webp',
        tags: ['account', 'business', 'setup'],
        estimatedTime: '3 minutes'
      },
      {
        question: 'What documents do I need?',
        subtitle: 'Required documentation checklist',
        answer: 'For business accounts, you\'ll need: Business registration certificate, Tax identification number, Proof of address, Director identification documents, and beneficial ownership information. Personal accounts require ID and proof of address.',
        image: 'assets/hero/faq/faq-2.webp',
        tags: ['documents', 'verification', 'KYC'],
        estimatedTime: '5 minutes'
      },
      {
        question: 'How long does verification take?',
        subtitle: 'Account approval timeline',
        answer: 'Most accounts are verified within 24 hours. Complex business structures may take up to 3 business days. You\'ll receive real-time updates via email and SMS throughout the process.',
        image: 'assets/hero/faq/faq-3.webp',
        tags: ['verification', 'timeline', 'approval'],
        estimatedTime: '24 hours'
      }
    ],
    'pricing': [
      {
        question: 'What are the monthly fees?',
        subtitle: 'Transparent pricing structure',
        answer: 'Personal accounts start free with basic features. Business accounts start at €9.90/month with no hidden fees. Premium plans include advanced analytics, priority support, and unlimited transactions.',
        image: 'assets/hero/faq/faq-2.webp',
        tags: ['pricing', 'fees', 'plans'],
        estimatedTime: 'Free to start'
      },
      {
        question: 'Are there transaction limits?',
        subtitle: 'Transaction and transfer limits',
        answer: 'Personal accounts have €10,000 monthly limits. Business accounts start with €50,000 monthly limits, with higher limits available upon request. All limits can be increased based on your business needs.',
        image: 'assets/hero/faq/faq-1.webp',
        tags: ['limits', 'transactions', 'business'],
        estimatedTime: 'Instant'
      },
      {
        question: 'Do you charge for international transfers?',
        subtitle: 'Global transfer pricing',
        answer: 'We offer competitive rates: €2.99 for EU transfers, €4.99 for global transfers. Premium accounts get 5 free international transfers monthly. Real exchange rates with transparent fees.',
        image: 'assets/hero/faq/faq-4.webp',
        tags: ['international', 'transfers', 'fees'],
        estimatedTime: '1-3 days'
      }
    ],
    'security': [
      {
        question: 'How secure is my money?',
        subtitle: 'Bank-grade security measures',
        answer: 'Your funds are protected by deposit guarantee schemes up to €100,000. We use 256-bit encryption, multi-factor authentication, and real-time fraud monitoring. All data is stored in secure, regulated data centers.',
        image: 'assets/hero/faq/faq-3.webp',
        tags: ['security', 'protection', 'encryption'],
        estimatedTime: 'Always protected'
      },
      {
        question: 'What is two-factor authentication?',
        subtitle: 'Enhanced account security',
        answer: '2FA adds an extra layer of security by requiring a second verification step. We support SMS codes, authenticator apps, and biometric verification for the highest level of account protection.',
        image: 'assets/hero/faq/faq-1.webp',
        tags: ['2FA', 'authentication', 'security'],
        estimatedTime: '30 seconds'
      },
      {
        question: 'How do you prevent fraud?',
        subtitle: 'Advanced fraud protection',
        answer: 'Our AI-powered system monitors transactions 24/7, detecting suspicious patterns instantly. We use machine learning, device fingerprinting, and behavioral analysis to protect your account.',
        image: 'assets/hero/faq/faq-2.webp',
        tags: ['fraud', 'AI', 'monitoring'],
        estimatedTime: 'Real-time'
      }
    ],
    'features': [
      {
        question: 'Can I issue virtual cards?',
        subtitle: 'Instant digital card creation',
        answer: 'Yes! Create unlimited virtual cards instantly for online purchases, subscriptions, or team expenses. Set spending limits, freeze/unfreeze cards, and track all transactions in real-time.',
        image: 'assets/hero/faq/faq-4.webp',
        tags: ['virtual cards', 'digital', 'instant'],
        estimatedTime: 'Instant'
      },
      {
        question: 'Do you offer API integration?',
        subtitle: 'Developer-friendly banking',
        answer: 'Yes, we provide comprehensive REST APIs for payment processing, account management, and financial data. Full documentation, SDKs, and sandbox environment available for developers.',
        image: 'assets/hero/faq/faq-1.webp',
        tags: ['API', 'integration', 'developers'],
        estimatedTime: 'Hours to integrate'
      },
      {
        question: 'Is there mobile app support?',
        subtitle: 'Banking on the go',
        answer: 'Our mobile apps for iOS and Android offer full banking functionality: transfers, payments, card management, spending insights, and more. Biometric login and push notifications included.',
        image: 'assets/hero/faq/faq-3.webp',
        tags: ['mobile', 'app', 'iOS', 'Android'],
        estimatedTime: 'Download now'
      }
    ]
  };

  // Support options
  supportOptions = [
    {
      type: 'Live Chat',
      description: 'Instant support via chat',
      availability: '24/7',
      responseTime: '< 2 minutes',
      icon: 'message-circle'
    },
    {
      type: 'Phone Support',
      description: 'Speak with our experts',
      availability: 'Business hours',
      responseTime: 'Immediate',
      icon: 'phone'
    },
    {
      type: 'Email Support',
      description: 'Detailed written assistance',
      availability: '24/7',
      responseTime: '< 4 hours',
      icon: 'mail'
    },
    {
      type: 'Help Center',
      description: 'Self-service resources',
      availability: 'Always',
      responseTime: 'Instant',
      icon: 'book'
    }
  ];

  // Computed properties
  currentFaqItems = computed(() => {
    return this.faqData[this.selectedCategory() as keyof typeof this.faqData] || [];
  });

  currentFaq = computed(() => {
    const items = this.currentFaqItems();
    return items[this.selectedIndex()] || items[0];
  });

  ngOnInit(): void {
    // Initialize with first item of first category
    this.selectCategory('getting-started');
  }

  selectCategory(categoryId: string): void {
    if (categoryId !== this.selectedCategory()) {
      this.isTransitioning.set(true);

      setTimeout(() => {
        this.selectedCategory.set(categoryId);
        this.selectedIndex.set(0);
        this.isTransitioning.set(false);
      }, 150);
    }
  }

  selectFaq(index: number): void {
    if (index !== this.selectedIndex()) {
      this.isTransitioning.set(true);

      setTimeout(() => {
        this.selectedIndex.set(index);
        this.isTransitioning.set(false);
      }, 150);
    }
  }

  getCategoryColor(categoryId: string): string {
    const category = this.faqCategories.find(cat => cat.id === categoryId);
    return category?.color || 'blue';
  }

  onContactSupport(): void {
    // Add analytics tracking or contact form opening logic
    console.log('Contact support clicked');
  }

  onSearchFaq(query: string): void {
    // Add search functionality
    console.log('FAQ search:', query);
  }
}
