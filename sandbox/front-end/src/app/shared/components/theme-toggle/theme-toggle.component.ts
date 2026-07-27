import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button (click)="themeService.toggleTheme()" aria-label="Toggle theme">
      Switch to {{ themeService.currentTheme() === 'light' ? 'Dark' : 'Light' }} Mode
    </button>
  `
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}