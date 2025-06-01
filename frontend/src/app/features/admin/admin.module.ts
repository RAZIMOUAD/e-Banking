import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { adminRoutes } from './admin.routes';

// Import des composants standalone
import { AdminSectionComponent } from './admin-section.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes),
    AdminSectionComponent // ✅ standalone
  ]
})
export class AdminModule {}
