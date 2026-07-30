import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

type Theme = 'light' | 'dark';

@Component({
   selector: 'app-root',
   imports: [RouterOutlet],
   templateUrl: './app.component.html',
   styleUrl: './app.component.scss'
})
export class App {
   private readonly document = inject(DOCUMENT);
   private readonly themeStorageKey = 'eventhub-theme';

   protected readonly title = signal('eventhub');
   protected readonly theme = signal<Theme>('light');

   constructor() {
      this.initializeTheme();
   }

   protected readonly themeToggleLabel = () =>
      this.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

   protected toggleTheme(): void {
      const nextTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
      this.applyTheme(nextTheme);
      localStorage.setItem(this.themeStorageKey, nextTheme);
   }

   private initializeTheme(): void {
      const storedTheme = localStorage.getItem(this.themeStorageKey);

      if (storedTheme === 'light' || storedTheme === 'dark') {
         this.applyTheme(storedTheme);
         return;
      }

      const preferredTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
         ? 'dark'
         : 'light';

      this.applyTheme(preferredTheme);
   }

   private applyTheme(theme: Theme): void {
      this.theme.set(theme);
      this.document.documentElement.setAttribute('data-bs-theme', theme);
   }
}
