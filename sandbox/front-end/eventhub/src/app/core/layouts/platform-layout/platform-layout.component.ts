import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { AppLayoutContext, LayoutNavItem } from '../../models/layout.models';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MobileBottomNavComponent } from '../../../shared/components/mobile-bottom-nav/mobile-bottom-nav.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

const PLATFORM_NAV_ITEMS: LayoutNavItem[] = [
   { label: 'Dashboard', route: '/platform/dashboard', icon: 'layout-dashboard', exact: true },
   { label: 'Organizers', route: '/platform/organizers', icon: 'users' },
   { label: 'Billing', route: '/platform/billing', icon: 'receipt-text' },
   { label: 'Tickets', route: '/platform/tickets', icon: 'messages-square' }
];

const ORGANIZER_NAV_ITEMS: LayoutNavItem[] = [
   { label: 'Dashboard', route: '/organizer/dashboard', icon: 'layout-dashboard', exact: true },
   { label: 'Employees', route: '/organizer/employees', icon: 'badge-check' },
   { label: 'Events', route: '/organizer/events', icon: 'calendar-fold' },
   { label: 'Settings', route: '/organizer/settings', icon: 'settings' }
];

@Component({
   selector: 'app-platform-layout',
   standalone: true,
   imports: [SidebarComponent, HeaderComponent, MobileBottomNavComponent],
   templateUrl: './platform-layout.component.html',
   styleUrl: './platform-layout.component.scss'
})
export class PlatformLayoutComponent {
   private readonly destroyRef = inject(DestroyRef);

   readonly layoutContext = input<AppLayoutContext>('platform');
   readonly profileName = input<string>('John Dela Cruz');
   readonly profileRole = input<string>('');
   readonly fluidContent = input<boolean>(false);
   readonly navItems = input<LayoutNavItem[] | null>(null);

   protected readonly isMobile = signal<boolean>(false);
   protected readonly collapsed = signal<boolean>(false);
   protected readonly showCollapsedSidebar = computed<boolean>(
      () => !this.isMobile() && this.collapsed()
   );
   protected readonly resolvedNavItems = computed<LayoutNavItem[]>(() => {
      const navItems = this.navItems();

      if (Array.isArray(navItems) && navItems.length > 0) {
         return navItems;
      }

      return this.layoutContext() === 'organizer' ? ORGANIZER_NAV_ITEMS : PLATFORM_NAV_ITEMS;
   });
   protected readonly resolvedHomeRoute = computed<string>(
      () => this.resolvedNavItems()[0]?.route ?? '/platform/dashboard'
   );
   protected readonly resolvedProfileRole = computed<string>(() => {
      const role = this.profileRole().trim();

      if (role.length > 0) {
         return role;
      }

      return this.layoutContext() === 'organizer' ? 'Organizer Admin' : 'Platform Owner';
   });

   constructor() {
      this.initializeViewportWatcher();
   }

   private initializeViewportWatcher(): void {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
         return;
      }

      const mediaQuery = window.matchMedia('(max-width: 992px)');
      const syncViewportState = (matches: boolean): void => {
         this.isMobile.set(matches);
      };

      syncViewportState(mediaQuery.matches);

      const handleViewportChange = (event: MediaQueryListEvent): void => {
         syncViewportState(event.matches);
      };

      mediaQuery.addEventListener('change', handleViewportChange);
      this.destroyRef.onDestroy(() => {
         mediaQuery.removeEventListener('change', handleViewportChange);
      });
   }
}
