import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly document = inject(DOCUMENT);
    private readonly STORAGE_KEY = 'app-theme';

    // 1. Initialize state from localStorage or system preference
    private readonly themeSignal = signal<Theme>(this.getInitialTheme());

    // 2. Expose read-only state
    readonly currentTheme = this.themeSignal.asReadonly();

    constructor() {
        // 3. Reactively update DOM & storage whenever themeSignal changes
        effect(() => {
            const theme = this.themeSignal();
            const root = this.document.documentElement;

            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }

            localStorage.setItem(this.STORAGE_KEY, theme);
        });
    }

    toggleTheme(): void {
        this.themeSignal.update(current => (current === 'light' ? 'dark' : 'light'));
    }

    setTheme(theme: Theme): void {
        this.themeSignal.set(theme);
    }

    private getInitialTheme(): Theme {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
        if (savedTheme) {
            return savedTheme;
        }
        // Fallback to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}