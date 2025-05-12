import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {}
