import { DOCUMENT } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly themeStorageKey = 'eventhub-theme';

  readonly brandName = input<string>('EventHub');
  readonly profileName = input<string>('John Dela Cruz');
  readonly showThemeToggle = input<boolean>(true);

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
}
