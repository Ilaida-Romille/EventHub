import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
   LoginFormComponent,
   LoginFormValue
} from '../../components/login-form/login-form.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { AuthService } from '../../../../core/services/auth.service';

type Theme = 'light' | 'dark';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [RouterLink, LoginFormComponent, LucideIconComponent],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss'
})
export class LoginComponent {
   private readonly document = inject(DOCUMENT);
   private readonly router = inject(Router);
   private readonly authService = inject(AuthService);
   private readonly themeStorageKey = 'eventhub-theme';

   protected readonly theme = signal<Theme>('light');
   protected readonly isSubmitting = signal<boolean>(false);
   protected readonly authError = signal<string | null>(null);

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

   private initializeThemeFromDocument(): void {
      const activeTheme = this.document.documentElement.getAttribute('data-bs-theme');
      this.theme.set(activeTheme === 'dark' ? 'dark' : 'light');
   }

   protected async onLoginSubmit(formValue: LoginFormValue): Promise<void> {
      this.authError.set(null);
      this.isSubmitting.set(true);

      try {
         const session = await firstValueFrom(this.authService.login(formValue));
         await this.router.navigateByUrl(this.authService.resolveLandingRoute(session));
      } catch {
         this.authError.set('Invalid email or password. Please check your credentials.');
      } finally {
         this.isSubmitting.set(false);
      }
   }
}
