import { Injectable, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, switchMap, map, throwError } from 'rxjs';
import { AuthSession, LoginCredentials, MockUser } from '../models/auth.model';
import { Attendee } from '../models/attendee.model';
import { AttendeeService } from './attendee.service';
import { MockApiService } from './mock-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
   private readonly router = inject(Router);
   private readonly mockApi = inject(MockApiService);
   private readonly attendeeService = inject(AttendeeService);
   private readonly sessionStorageKey = 'eventhub-auth-session';

   readonly session = signal<AuthSession | null>(this.restoreSession());
   readonly isAuthenticated = computed(() => this.session() !== null);

   login(credentials: LoginCredentials): Observable<AuthSession> {
      const normalizedEmail = credentials.email.trim().toLowerCase();

      return this.mockApi.fetchResource<MockUser[]>('users.json').pipe(
         switchMap((users) => {
            const matchingUser = users.find((user) => user.email.toLowerCase() === normalizedEmail);

            if (matchingUser) {
               if (matchingUser.password !== credentials.password) {
                  return throwError(() => new Error('Invalid credentials'));
               }

               return of(this.createSessionFromUser(matchingUser, credentials.remember));
            }

            return this.attendeeService
               .getAttendeeByEmail(normalizedEmail)
               .pipe(
                  map((attendee) => this.createSessionFromAttendee(attendee, credentials.remember))
               );
         })
      );
   }

   private createSessionFromUser(user: MockUser, remember: boolean): AuthSession {
      const nextSession: AuthSession = {
         userId: user.id,
         email: user.email,
         firstName: user.firstName,
         lastName: user.lastName,
         role: user.role,
         organizationId: user.organizationId,
         avatarUrl: user.avatarUrl
      };

      this.session.set(nextSession);
      this.persistSession(nextSession, remember);
      return nextSession;
   }

   private createSessionFromAttendee(Attendee: Attendee, remember: boolean): AuthSession {
      const nextSession: AuthSession = {
         userId: Attendee.id ?? '',
         email: Attendee.email,
         firstName: Attendee.firstName,
         lastName: Attendee.lastName,
         role: 'attendee',
         organizationId: null,
         avatarUrl: Attendee.avatarUrl
      };

      this.session.set(nextSession);
      this.persistSession(nextSession, remember);
      return nextSession;
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
         case 'attendee':
            return '/dashboard';
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
