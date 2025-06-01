import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '@shared/directives/count-up.directive';

@Component({
  selector: 'app-tech-stats',
  standalone: true,
  imports: [CommonModule, CountUpDirective],
  templateUrl: './TechStats.component.html'
})
export class TechStatsComponent {}
