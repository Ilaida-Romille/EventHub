import { Routes } from '@angular/router';

export const routes: Routes = [
   {
      path: 'platform',
      loadChildren: () =>
         import('./features/platform/platform.routes').then((m) => m.PLATFORM_ROUTES)
   },
   {
      path: '',
      loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
   },
   { path: '**', redirectTo: 'login' }
];
