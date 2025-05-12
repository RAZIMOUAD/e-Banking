import { Component } from '@angular/core';
import {HeroTechSectionComponent} from "@features/public/pages/features/hero-tech/hero-tech.component";
import {
  SecurityComparaisonComponent
} from "@features/public/pages/features/security-comparison/security-comparaison.component";
import {
  ArchitectureBlockComponent
} from "@features/public/pages/features/architecture-block/architecture-block.component";
import {TechStatsComponent} from "@features/public/pages/features/TechStats/TechStats.component";
import {VisionTimelineComponent} from "@features/public/pages/features/vision-timeline/vision-timeline.component";
import {FinalCtaTechComponent} from "@features/public/pages/features/final-cta-tech/final-cta-tech.component";

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [HeroTechSectionComponent, SecurityComparaisonComponent,
    ArchitectureBlockComponent, TechStatsComponent,
    VisionTimelineComponent, FinalCtaTechComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent {

}
