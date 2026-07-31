import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrivilegedLayoutComponent } from '../../../../core/layouts/privileged-layout/privileged-layout.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-organizer-dashboard',
   imports: [RouterLink, LucideIconComponent, PrivilegedLayoutComponent],
   templateUrl: './organizer-dashboard.component.html',
   styleUrl: './organizer-dashboard.component.scss'
})
export class OrganizerDashboardComponent {
   protected readonly workspaceCards = [
      {
         title: 'Manage Employees',
         body: 'Add, remove, and manage the employees on your corporate account.',
         icon: 'users',
         actionLabel: 'Open',
         route: '/organizer/employees'
      },
      {
         title: 'Manage Events',
         body: "Create, edit, and configure your company's premium events.",
         icon: 'calendar-fold',
         actionLabel: 'Open',
         route: '/organizer/events'
      },
      {
         title: 'Settings',
         body: 'Update your corporate company profile and account global preferences.',
         icon: 'settings',
         actionLabel: 'Open',
         route: '/organizer/dashboard'
      },
      {
         title: 'File a Ticket / Request',
         body: 'Reach out securely to the EventHub platform operations team for help.',
         icon: 'messages-square',
         actionLabel: 'New Ticket',
         route: '/organizer/dashboard'
      }
   ];
}
