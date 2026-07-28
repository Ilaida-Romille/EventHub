import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, signal, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutNavItem } from '../../../core/models/layout.models';
import { AuthService } from '../../../core/services/auth.service';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

type Theme = 'light' | 'dark';

const DEFAULT_PLATFORM_NAV_ITEMS: LayoutNavItem[] = [
   { label: 'Item 1', route: '/#', icon: 'circle-question-mark', exact: true },
   { label: 'Item 2', route: '/#', icon: 'circle-question-mark' },
   { label: 'Item 3', route: '/#', icon: 'circle-question-mark' },
   { label: 'Item 4', route: '/#', icon: 'circle-question-mark' }
];

@Component({
   selector: 'app-sidebar',
   standalone: true,
   imports: [RouterLink, RouterLinkActive, LucideIconComponent],
   templateUrl: './sidebar.component.html',
   styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
   private readonly document = inject(DOCUMENT);
   private readonly authService = inject(AuthService);
   private readonly themeStorageKey = 'eventhub-theme';

   readonly profileName = input<string>('User Name');
   readonly profileRole = input<string>('User Role');
   readonly homeRoute = input<string>('/platform/dashboard');
   readonly navItems = input<LayoutNavItem[]>(DEFAULT_PLATFORM_NAV_ITEMS);

   readonly isCollapsed = model<boolean>(false);

   protected readonly theme = signal<Theme>('light');

   protected readonly showCollapsed = computed<boolean>(() => this.isCollapsed());

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

   protected onLogout(event: MouseEvent): void {
      event.preventDefault();
      this.authService.logout();
   }

   private initializeThemeFromDocument(): void {
      const activeTheme = this.document.documentElement.getAttribute('data-bs-theme');
      this.theme.set(activeTheme === 'dark' ? 'dark' : 'light');
   }
}
