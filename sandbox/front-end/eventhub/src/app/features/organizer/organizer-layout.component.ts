import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ORGANIZER_ROUTE_PATHS } from './organizer.routes';

@Component({
  selector: 'app-organizer-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './organizer-layout.component.html',
  styleUrls: ['./organizer-layout.component.css']
})
export class OrganizerLayoutComponent {

  protected readonly navigationItems = [
    {
      label: 'Dashboard',
      path: ORGANIZER_ROUTE_PATHS.dashboard,
    },
    {
      label: 'Employees',
      path: ORGANIZER_ROUTE_PATHS.employees,
    },
    {
      label: 'Events',
      path: ORGANIZER_ROUTE_PATHS.events,
    },
  ] as const;
}