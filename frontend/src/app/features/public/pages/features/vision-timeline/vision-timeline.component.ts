import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankingLucideIconsModule } from '@shared/modules/banking-lucide-icons.module';

@Component({
  selector: 'app-vision-timeline',
  standalone: true,
  imports: [CommonModule, BankingLucideIconsModule],
  templateUrl: './vision-timeline.component.html',
})
export class VisionTimelineComponent implements AfterViewInit {
  @ViewChild('timelineContainer') timelineContainer!: ElementRef<HTMLElement>;
  scrollProgress: number = 0;

  ngAfterViewInit(): void {
    this.updateProgress(this.timelineContainer.nativeElement);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateProgress(this.timelineContainer.nativeElement);
  }

  updateProgress(el: HTMLElement) {
    const percent = (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100;
    this.scrollProgress = Math.min(100, Math.floor(percent));
  }
}
