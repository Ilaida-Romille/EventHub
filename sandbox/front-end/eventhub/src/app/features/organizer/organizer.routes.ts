import { Routes } from '@angular/router';
import { OrganizerDashboardComponent } from './pages/organizer-dashboard/organizer-dashboard.component';
import { OrganizerEmployeesComponent } from './pages/organizer-employees/organizer-employees.component';
import { OrganizerEventsComponent } from './pages/organizer-events/organizer-events.component';

export const ORGANIZER_ROUTES: Routes = [
   { path: 'dashboard', component: OrganizerDashboardComponent },
   { path: 'employees', component: OrganizerEmployeesComponent },
   { path: 'events', component: OrganizerEventsComponent },
   { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];
