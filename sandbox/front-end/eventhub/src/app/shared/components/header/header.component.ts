import { DOCUMENT } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

type Theme = 'light' | 'dark';

@Component({
   selector: 'app-header',
   standalone: true,
   imports: [LucideIconComponent],
   templateUrl: './header.component.html',
   styleUrl: './header.component.scss'
})
export class HeaderComponent {
   private readonly document = inject(DOCUMENT);
   private readonly authService = inject(AuthService);
   private readonly themeStorageKey = 'eventhub-theme';

   readonly brandName = input<string>('EventHub');
   readonly profileName = input<string>('John Dela Cruz');
   readonly showThemeToggle = input<boolean>(true);
   readonly showProfile = input<boolean>(true);
   readonly showProfileName = input<boolean>(true);
   readonly showBrandLogo = input<boolean>(true);
   readonly logoutRoute = input<string>('/login');

   protected readonly theme = signal<Theme>('light');

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

   protected onLogout(event: MouseEvent): void {
      event.preventDefault();
      this.authService.logout();
   }

   private initializeThemeFromDocument(): void {
      const activeTheme = this.document.documentElement.getAttribute('data-bs-theme');
      this.theme.set(activeTheme === 'dark' ? 'dark' : 'light');
   }
}
