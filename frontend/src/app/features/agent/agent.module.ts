// agent.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { agentRoutes } from './agent.routes';
import { AgentSectionComponent } from './agent-section.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(agentRoutes),
    AgentSectionComponent
  ]
})
export class AgentModule {}
