import { Routes } from '@angular/router';
import { OrganizerDashboardComponent } from './pages/dashboard/organizer-dashboard.component';

export const ORGANIZER_ROUTES: Routes = [
   { path: 'dashboard', component: OrganizerDashboardComponent },
   { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];
