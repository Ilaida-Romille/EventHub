import { Routes } from '@angular/router';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { EventRegistrationComponent } from './pages/event-registration/event-registration.component';
import { UpcomingEventsComponent } from './pages/upcoming-events/upcoming-events.component';

export const USERS_ROUTES: Routes = [
   { path: 'upcoming-events', component: UpcomingEventsComponent },
   { path: 'event-details', component: EventDetailsComponent },
   { path: 'event-registration', component: EventRegistrationComponent },
   { path: '', pathMatch: 'full', redirectTo: 'upcoming-events' }
];
