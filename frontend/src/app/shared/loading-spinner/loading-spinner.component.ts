import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-container" *ngIf="isLoading">
      <div class="spinner-overlay"></div>
      <div class="spinner-wrapper">
        <mat-spinner [diameter]="50" color="primary"></mat-spinner>
        <p class="loading-text">Chargement...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .spinner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(2px);
    }

    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 10000;
    }

    .loading-text {
      margin-top: 16px;
      font-size: 16px;
      color: #3b82f6;
      font-weight: 500;
    }
  `]
})
export class LoadingSpinnerComponent {
  // Cette propriété sera contrôlée par un service de chargement global
  get isLoading(): boolean {
    return document.body.classList.contains('api-loading');
  }
}
