import { Service, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, throwError } from 'rxjs';
import { AuthSession, LoginCredentials, MockUser } from '../models/auth.models';
import { MockApiService } from './mock-api.service';

@Service()
export class AuthService {
   private readonly router = inject(Router);
   private readonly mockApi = inject(MockApiService);
   private readonly sessionStorageKey = 'eventhub-auth-session';

   readonly session = signal<AuthSession | null>(this.restoreSession());
   readonly isAuthenticated = computed(() => this.session() !== null);

   login(credentials: LoginCredentials): Observable<AuthSession> {
      const normalizedEmail = credentials.email.trim().toLowerCase();

      return this.mockApi.fetchResource<MockUser[]>('auth/users.json').pipe(
         map((users) => {
            const matchingUser = users.find(
               (user) =>
                  user.isActive &&
                  user.email.toLowerCase() === normalizedEmail &&
                  user.password === credentials.password
            );

            if (!matchingUser) {
               throw new Error('Invalid credentials');
            }

            const nextSession: AuthSession = {
               userId: matchingUser.id,
               email: matchingUser.email,
               displayName: matchingUser.displayName,
               role: matchingUser.role,
               organizationId: matchingUser.organizationId
            };

            this.session.set(nextSession);
            this.persistSession(nextSession, credentials.remember);
            return nextSession;
         })
      );
   }

   logout(): void {
      this.session.set(null);
      localStorage.removeItem(this.sessionStorageKey);
      sessionStorage.removeItem(this.sessionStorageKey);
      void this.router.navigateByUrl('/login');
   }

   resolveLandingRoute(session: AuthSession): string {
      switch (session.role) {
         case 'platform_admin':
            return '/platform/dashboard';
         case 'organizer_admin':
            return '/organizer/dashboard';
         case 'employee':
            return '/users/upcoming-events';
         default:
            return '/login';
      }
   }

   loginError(): Observable<never> {
      return throwError(() => new Error('Invalid credentials'));
   }

   private restoreSession(): AuthSession | null {
      const persistedSession =
         localStorage.getItem(this.sessionStorageKey) ??
         sessionStorage.getItem(this.sessionStorageKey);

      if (!persistedSession) {
         return null;
      }

      try {
         return JSON.parse(persistedSession) as AuthSession;
      } catch {
         localStorage.removeItem(this.sessionStorageKey);
         sessionStorage.removeItem(this.sessionStorageKey);
         return null;
      }
   }

   private persistSession(session: AuthSession, remember: boolean): void {
      const serializedSession = JSON.stringify(session);

      if (remember) {
         localStorage.setItem(this.sessionStorageKey, serializedSession);
         sessionStorage.removeItem(this.sessionStorageKey);
         return;
      }

      sessionStorage.setItem(this.sessionStorageKey, serializedSession);
      localStorage.removeItem(this.sessionStorageKey);
   }
}
