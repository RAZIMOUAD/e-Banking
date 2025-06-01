import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankingLucideIconsModule } from '@shared/modules/banking-lucide-icons.module';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-security-comparaison',
  standalone: true,
  imports: [CommonModule, BankingLucideIconsModule, NgOptimizedImage],
  templateUrl: './security-comparaison.component.html',
})
export class SecurityComparaisonComponent {
  selected: 'standard' | 'ebank' = 'ebank';

  comparisonData = {
    standard: [
      {
        title: 'Authentication',
        description: 'Login via password only, stored in legacy systems with limited hashing.',
        icon: 'Lock',
      },
      {
        title: 'Fraud Detection',
        description: 'Manual verification of suspicious transactions. Delayed response.',
        icon: 'Bug',
      },
      {
        title: 'Audit & Compliance',
        description: 'Basic internal logs. Minimal GDPR or ISO compliance in place.',
        icon: 'AlertCircle',
      },
      {
        title: 'Banking APIs',
        description: 'Closed systems. No open banking, minimal API support.',
        icon: 'ServerOff',
      },
    ],
    ebank: [
      {
        title: 'Biometric & 2FA',
        description: 'Authentication via fingerprint, WebAuthn, and real-time OTP delivery.',
        icon: 'Fingerprint',
      },
      {
        title: 'AI Fraud Prevention',
        description: 'Behavioral analytics with real-time alerts and auto-blocking.',
        icon: 'ScanFace',
      },
      {
        title: 'Full Audit Trail',
        description: 'Immutable and encrypted logs. Fully GDPR, ISO 27001 & PCI DSS compliant.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Next-Gen APIs',
        description: 'RESTful + OpenBanking v3 APIs secured with OAuth2 and rate-limited tokens.',
        icon: 'Globe',
      },
    ]
  };
}
