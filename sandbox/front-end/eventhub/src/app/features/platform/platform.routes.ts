import { Routes } from '@angular/router';
import { BillingComponent } from './pages/billing/billing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrganizerComponent } from './pages/organizers/organizer.component';
import { TicketsComponent } from './pages/tickets/tickets.component';

export const PLATFORM_ROUTES: Routes = [
   { path: 'dashboard', component: DashboardComponent },
   { path: 'organizers', component: OrganizerComponent },
   { path: 'billing', component: BillingComponent },
   { path: 'tickets', component: TicketsComponent }
];
