import { DOCUMENT } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon/lucide-icon.component';

type Theme = 'light' | 'dark';

type NavItem = {
   label: string;
   route: string;
   icon: string;
   exact?: boolean;
};

@Component({
   selector: 'app-platform-layout',
   standalone: true,
   imports: [RouterLink, RouterLinkActive, LucideIconComponent],
   templateUrl: './platform-layout.component.html',
   styleUrl: './platform-layout.component.scss'
})
export class PlatformLayoutComponent {
   private readonly document = inject(DOCUMENT);
   private readonly themeStorageKey = 'eventhub-theme';

   readonly title = input.required<string>();
   readonly subtitle = input.required<string>();
   readonly profileName = input<string>('John Dela Cruz');
   readonly profileRole = input<string>('Platform Owner');

   protected readonly theme = signal<Theme>('light');
   protected readonly collapsed = signal<boolean>(false);

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
      this.collapsed.update((value) => !value);
   }

   private initializeThemeFromDocument(): void {
      const activeTheme = this.document.documentElement.getAttribute('data-bs-theme');
      this.theme.set(activeTheme === 'dark' ? 'dark' : 'light');
   }
}
