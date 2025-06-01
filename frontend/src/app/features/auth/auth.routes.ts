import { Routes } from '@angular/router';


import { RegisterComponent } from './pages/register/register.component';
import { RedirectIfAuthenticatedGuard } from '@core/guards/redirect-if-authenticated.guard';
import {PublicLayoutComponent} from "../../layouts/public-layout/public-layout.component";
import {LoginComponent} from "@features/auth/pages/login/login.component";

export const authRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent, // Layout contenant navbar/footer
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [RedirectIfAuthenticatedGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [RedirectIfAuthenticatedGuard]
      }
    ]
  }
];
