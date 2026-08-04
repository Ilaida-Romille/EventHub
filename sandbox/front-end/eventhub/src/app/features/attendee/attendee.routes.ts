import { Routes } from '@angular/router';

export const ATTENDEE_ROUTE_PATHS = {
  events: 'events',
  registration: 'registration',
  agenda: 'agenda',
} as const;

export const ATTENDEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./attendee-layout.component').then((m) => m.AttendeeLayoutComponent),
    children: [
      {path: '', redirectTo: ATTENDEE_ROUTE_PATHS.events, pathMatch: 'full'},
      {
        path: ATTENDEE_ROUTE_PATHS.events,
        loadComponent: () =>
          import('./pages/upcoming-events/upcoming-events.component').then((m) => m.UpcomingEventsComponent),
        title: 'EventHub | Upcoming Events'
      },
      {
        path: `${ATTENDEE_ROUTE_PATHS.registration}/:id`,
        loadComponent: () =>
          import('./pages/registration/registration.component').then((m) => m.RegistrationComponent),
        title: 'EventHub | Registration'
      },
      {
        path: `${ATTENDEE_ROUTE_PATHS.agenda}/:eventId`,
        loadComponent: () =>
          import('./pages/agenda/agenda.component').then((m) => m.AgendaComponent),
        title: 'EventHub | Agenda'
      }
    ]
  }
]