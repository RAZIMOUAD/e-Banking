import { Routes } from '@angular/router';
import {PublicLayoutComponent} from "./layouts/public-layout/public-layout.component";
import { HomeComponent } from '@features/public/pages/home/home.component';
import { FeaturesComponent } from '@features/public/pages/features/features.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent }
    ]
  }
];

