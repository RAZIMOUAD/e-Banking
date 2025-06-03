import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { adminRoutes } from './admin.routes';

// Import standalone components
import { AdminSectionComponent } from './admin-section.component';

// Import Material modules for better organization
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    // No declarations needed since we're using standalone components
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes),

    // Material Design modules
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatSnackBarModule,

    // Standalone component
    AdminSectionComponent
  ],
  providers: [
    // Add any admin-specific services here
  ],
  exports: [
    // Export components if needed by other modules
    AdminSectionComponent
  ]
})
export class AdminModule {
  constructor() {
    console.log('AdminModule initialized successfully');
  }
}
