import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-organizer-dashboard',
   standalone: true,
   imports: [RouterLink, LucideIconComponent, PlatformLayoutComponent],
   templateUrl: './organizer-dashboard.component.html',
   styleUrl: './organizer-dashboard.component.scss'
})
export class OrganizerDashboardComponent {
   protected readonly workspaceCards = [
      {
         title: 'Manage Employees',
         body: 'Add, remove, and manage the employees on your corporate account.',
         icon: 'badge-check',
         actionLabel: 'Open'
      },
      {
         title: 'Manage Events',
         body: "Create, edit, and configure your company's premium events.",
         icon: 'calendar-fold',
         actionLabel: 'Open'
      },
      {
         title: 'Settings',
         body: 'Update your corporate company profile and account global preferences.',
         icon: 'settings',
         actionLabel: 'Open'
      },
      {
         title: 'File a Ticket / Request',
         body: 'Reach out securely to the EventHub platform operations team for help.',
         icon: 'contact-round',
         actionLabel: 'New Ticket'
      }
   ];
}
