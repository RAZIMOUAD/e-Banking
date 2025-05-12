import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import {AdminSectionComponent} from "./admin-section/admin-section.component";
import {AgentSectionComponent} from "./agent-section/agent-section.component";
import {ClientSectionComponent} from "@features/public/pages/roles/client-section/client-section.component";
import {ComparerSectionComponent} from "@features/public/pages/roles/comparer-section/comparer-section.component";
import {FinalCtaSectionComponent} from "@features/public/pages/roles/final-cta/final-cta-section.component";

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [HeroSectionComponent, AdminSectionComponent,
    AgentSectionComponent,ClientSectionComponent,
    ComparerSectionComponent,FinalCtaSectionComponent],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {}
