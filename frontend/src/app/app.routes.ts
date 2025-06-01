// app.routes.ts
import { Routes } from '@angular/router';
import { publicRoutes } from '@features/public/public.routes';
import {DashbordComponent} from "./Agent/dashbord/dashbord.component";
import {TransactionsComponent} from "./Agent/transactions/transactions.component";
import {EnrolementComponent} from "./Agent/enrolement/enrolement.component";

export const routes: Routes = [
  ...publicRoutes,
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'client',
    loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
  },


   {path:'espaceAgent',component: DashbordComponent},
   {path:'transactions',component:TransactionsComponent},
  {path:'enrolement',component: EnrolementComponent}
];


