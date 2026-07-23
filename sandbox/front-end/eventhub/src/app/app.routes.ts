import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './platform/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'platform/dashboard', component: DashboardComponent},

  { path: '', redirectTo: 'login', pathMatch: 'full' } 
];