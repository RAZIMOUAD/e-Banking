// ✅ FeatureCardComponent – animé et visuel
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div
      class="bg-white rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl w-full max-w-sm mx-auto group"
    >
      <img
        [ngSrc]="imageSrc"
        [alt]="alt"
        width="400"
        height="250"
        class="w-full h-52 object-cover group-hover:brightness-105 transition duration-300"
      />

      <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>
  `,
  styleUrls: ['./feature-card.component.css']
})
export class FeatureCardComponent {
  @Input() imageSrc = '';
  @Input() title = '';
  @Input() description = '';
  @Input() alt = '';
}
