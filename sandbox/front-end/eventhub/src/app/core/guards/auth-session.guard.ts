import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AppUserRole } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
   const authService = inject(AuthService);
   const router = inject(Router);

   if (authService.isAuthenticated()) {
      return true;
   }

   return router.createUrlTree(['/login']);
};

export const publicOnlyGuard: CanActivateFn = () => {
   const authService = inject(AuthService);
   const router = inject(Router);
   const session = authService.session();

   if (!session) {
      return true;
   }

   return router.createUrlTree([authService.resolveLandingRoute(session)]);
};

export const roleGuard = (allowedRoles: AppUserRole[]): CanActivateFn => {
   return () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      const session = authService.session();

      if (!session) {
         return router.createUrlTree(['/login']);
      }

      if (allowedRoles.includes(session.role)) {
         return true;
      }

      return router.createUrlTree([authService.resolveLandingRoute(session)]);
   };
};
