import { Routes } from '@angular/router';
import { authGuard, publicOnlyGuard, roleGuard } from './core/guard/auth-session.guard';
import { LoginPage } from './features/login/pages/login-page/login-page.component';

export const ROUTE_PATHS = {
    landing: '',
    attendee: 'dashboard',
    organizer: 'organizer',
    platformOwner: 'platform-owner',
} as const;

export const routes: Routes = [
    // 1. Public / Auth Routes
    {
        path: ROUTE_PATHS.landing,
        canActivate: [publicOnlyGuard],
        component: LoginPage,
        title: 'EventHub | Log In',
    },

    // 2. Attendee Feature Section (Protected - requires login as attendee)
    {
        path: ROUTE_PATHS.attendee,
        canActivate: [authGuard, roleGuard],
        loadChildren: () =>
            import('./features/attendee/attendee.routes').then((m) => m.ATTENDEE_ROUTES),
    },

    // 3. Organizer Feature Section (Protected - requires login as organizer)
    {
        path: ROUTE_PATHS.organizer,
        canActivate: [authGuard, roleGuard],
        loadChildren: () =>
            import('./features/organizer/organizer.routes').then((m) => m.ORGANIZER_ROUTES),
    },

    // // 4. Platform Owner Feature Section (Protected - requires login as platformOwner)
    // {
    //     path: ROUTE_PATHS.platformOwner,
    //     canActivate: [authGuard, roleGuard],
    //     loadChildren: () =>
    //         import('./features/platform/platform.routes').then((m) => m.PLATFORM_ROUTES),
    // },

    // 5. Catch-all Wildcard Route
    {
        path: '**',
        redirectTo: ROUTE_PATHS.landing
    },
];