import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginFormComponent, LoginFormValue } from './login-form/login-form.component';

type Theme = 'light' | 'dark';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [RouterLink, LoginFormComponent],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss'
})
export class LoginComponent {
   private readonly document = inject(DOCUMENT);
   private readonly themeStorageKey = 'eventhub-theme';

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

   private initializeThemeFromDocument(): void {
      const activeTheme = this.document.documentElement.getAttribute('data-bs-theme');
      this.theme.set(activeTheme === 'dark' ? 'dark' : 'light');
   }

   onLoginSubmit(formValue: LoginFormValue): void {
      console.log('Login credentials:', formValue);
   }
}
