import { Routes } from '@angular/router';
import { ROUTE_PATHS } from '../../app.routes';

export const ORGANIZER_ROUTE_PATHS = {
  dashboard: 'dashboard',
  employees: 'employees',
  events: 'events'
} as const;


export const ORGANIZER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./organizer-layout.component').then((m) => m.OrganizerLayoutComponent),
    children: [
      { path: '', redirectTo: ORGANIZER_ROUTE_PATHS.dashboard, pathMatch: 'full' },
      {
        path: ORGANIZER_ROUTE_PATHS.dashboard,
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.OrganizerDashboardComponent),
        title: 'EventHub | Organizer Dashboard'
      },
      {
        path: ORGANIZER_ROUTE_PATHS.employees,
        loadComponent: () =>
          import('./pages/employees/employees.component').then((m) => m.OrganizerEmployeesComponent),
        title: 'EventHub | Organizer Employees'
      },
      {
        path: ORGANIZER_ROUTE_PATHS.events,
        loadComponent: () =>
          import('./pages/events/events.component').then((m) => m.OrganizerEventsComponent),
        title: 'EventHub | Organizer Events'
      }
    ]
  }
];