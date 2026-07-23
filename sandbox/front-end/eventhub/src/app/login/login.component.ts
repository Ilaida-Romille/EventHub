import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly document = inject(DOCUMENT);
  private fb = inject(FormBuilder);
  private readonly themeStorageKey = 'eventhub-theme';

  protected readonly theme = signal<Theme>('light');

  constructor() {
    this.initializeThemeFromDocument();
  }

  loginForm = this.fb.nonNullable.group({});

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

  onSubmit(): void {}
}