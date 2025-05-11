import { Component} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.css']
})
export class FaqSectionComponent {
  selectedIndex = 0;

  faqItems = [
    {
      question: 'How to open a business account?',
      subtitle: 'Get started in under 10 minutes.',
      answer: 'Open your account online, verify your identity, and receive your IBAN instantly.',
      image: 'assets/hero/faq/faq-1.webp'
    },
    {
      question: 'What are the monthly fees?',
      subtitle: 'Choose the right plan for your needs.',
      answer: 'Our plans start at €9.90/month. No hidden fees, full transparency.',
      image: 'assets/hero/faq/faq-2.webp'
    },
    {
      question: 'Can I issue virtual cards?',
      subtitle: 'Instant card issuing for your team.',
      answer: 'Yes! You can create and manage virtual cards in real time from your dashboard.',
      image: 'assets/hero/faq/faq-3.webp'
    },
    {
      question: 'Is support available 24/7?',
      subtitle: 'We’re here whenever you need us.',
      answer: 'Yes. Our customer success team is available by chat and email every day.',
      image: 'assets/hero/faq/faq-4.webp'
    },
  ];

  select(index: number) {
    this.selectedIndex = index;
  }
}
