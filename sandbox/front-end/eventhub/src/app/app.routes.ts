import { Routes } from '@angular/router';
import { authGuard, publicOnlyGuard, roleGuard } from './core/guards/auth-session.guard';

export const routes: Routes = [
   {
      path: 'platform',
      canActivate: [authGuard, roleGuard(['platform_admin'])],
      loadChildren: () =>
         import('./features/platform/platform.routes').then((m) => m.PLATFORM_ROUTES)
   },
   {
      path: 'organizer',
      canActivate: [authGuard, roleGuard(['organizer_admin'])],
      loadChildren: () =>
         import('./features/organizer/organizer.routes').then((m) => m.ORGANIZER_ROUTES)
   },
   {
      path: 'users',
      canActivate: [authGuard, roleGuard(['employee'])],
      loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES)
   },
   {
      path: '',
      canActivate: [publicOnlyGuard],
      loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
   },
   { path: '**', redirectTo: 'login' }
];
