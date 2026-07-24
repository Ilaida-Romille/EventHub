import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, output, signal, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

type Theme = 'light' | 'dark';

interface NavItem {
   label: string;
   route: string;
   icon: string;
   exact?: boolean;
}

@Component({
   selector: 'app-sidebar',
   standalone: true,
   imports: [RouterLink, RouterLinkActive, LucideIconComponent],
   templateUrl: './sidebar.component.html',
   styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
   private readonly document = inject(DOCUMENT);
   private readonly themeStorageKey = 'eventhub-theme';

   readonly profileName = input<string>('User Name');
   readonly profileRole = input<string>('User Role');
   readonly mobileMode = input<boolean>(false);
   readonly mobileOpen = input<boolean>(false);

   readonly isCollapsed = model<boolean>(false);
   readonly navItemSelected = output<void>();

   protected readonly theme = signal<Theme>('light');

   protected readonly showCollapsed = computed<boolean>(
      () => !this.mobileMode() && this.isCollapsed()
   );

   // TODO: Make navItems as inputs for reusability
   protected readonly navItems: NavItem[] = [
      { label: 'Dashboard', route: '/platform/dashboard', icon: 'layout-dashboard', exact: true },
      { label: 'Organizers', route: '/platform/organizers', icon: 'users' },
      { label: 'Billing', route: '/platform/billing', icon: 'receipt-text' },
      { label: 'Tickets', route: '/platform/tickets', icon: 'messages-square' }
   ];

   constructor() {
      this.initializeThemeFromDocument();
   }

   protected readonly themeToggleLabel = () =>
      this.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

   protected toggleTheme(): void {
      const nextTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
      this.theme.set(nextTheme);
      this.document.documentElement.setAttribute('data-bs-theme', nextTheme);
      localStorage.setItem(this.themeStorageKey, nextTheme);
   }

   protected toggleSidebar(): void {
      this.isCollapsed.update((value) => !value);
   }

   protected notifyNavItemSelected(): void {
      this.navItemSelected.emit();
   }

   private initializeThemeFromDocument(): void {
      const activeTheme = this.document.documentElement.getAttribute('data-bs-theme');
      this.theme.set(activeTheme === 'dark' ? 'dark' : 'light');
   }
}
