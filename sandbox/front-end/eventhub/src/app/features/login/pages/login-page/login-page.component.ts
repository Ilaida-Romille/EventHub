import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HeroPanel } from '../../components/hero-panel/hero-panel.component';
import { LoginCard } from '../../components/login-card/login-card.component';
import { LoginCredentials } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [HeroPanel, LoginCard],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPage {

  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  protected readonly isSubmitting = signal(false);

  protected readonly authError = signal<string | null>(null);

  protected async onLoginSubmit(formValue: LoginCredentials): Promise<void> {
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
