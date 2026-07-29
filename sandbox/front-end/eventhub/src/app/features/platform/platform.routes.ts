import { Routes } from '@angular/router';
import { PlatformBillingComponent } from './pages/platform-billing/platform-billing.component';
import { PlatformDashboardComponent } from './pages/platform-dashboard/platform-dashboard.component';
import { PlatformOrganizersComponent } from './pages/platform-organizers/platform-organizers.component';
import { PlatformTicketsComponent } from './pages/platform-tickets/platform-tickets.component';

export const PLATFORM_ROUTES: Routes = [
   { path: 'dashboard', component: PlatformDashboardComponent },
   { path: 'organizers', component: PlatformOrganizersComponent },
   { path: 'billing', component: PlatformBillingComponent },
   { path: 'tickets', component: PlatformTicketsComponent }
];
