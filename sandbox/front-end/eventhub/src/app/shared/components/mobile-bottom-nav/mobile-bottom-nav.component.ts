import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

interface BottomNavItem {
   label: string;
   route: string;
   icon: string;
   exact?: boolean;
}

@Component({
   selector: 'app-mobile-bottom-nav',
   standalone: true,
   imports: [RouterLink, RouterLinkActive, LucideIconComponent],
   templateUrl: './mobile-bottom-nav.component.html',
   styleUrl: './mobile-bottom-nav.component.scss'
})
export class MobileBottomNavComponent {
   protected readonly navItems: BottomNavItem[] = [
      { label: 'Dashboard', route: '/platform/dashboard', icon: 'layout-dashboard', exact: true },
      { label: 'Organizers', route: '/platform/organizers', icon: 'users' },
      { label: 'Billing', route: '/platform/billing', icon: 'receipt-text' },
      { label: 'Tickets', route: '/platform/tickets', icon: 'messages-square' }
   ];
}
