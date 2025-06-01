import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-agent-section',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './agent-section.component.html',
  styleUrls: ['./agent-section.component.css']
})
export class AgentSectionComponent {}
