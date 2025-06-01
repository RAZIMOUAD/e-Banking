import {Component, AfterViewInit, ElementRef, ViewChild, Renderer2, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-showcase',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card-showcase.component.html',
  styleUrls: ['./card-showcase.component.css'],
  encapsulation: ViewEncapsulation.None // ViewEncapsulation.None pour appliquer Tailwind correctement
})
export class CardShowcaseComponent implements AfterViewInit {
  @ViewChild('cardEl', { static: true }) cardEl!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    let rotation = 0;
    const animate = () => {
      rotation += 0.25;
      this.renderer.setStyle(
        this.cardEl.nativeElement,
        'transform',
        `rotateY(${rotation}deg)`
      );
      requestAnimationFrame(animate);
    };
    animate();
  }
}
