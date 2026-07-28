export type AppLayoutContext = 'platform' | 'organizer';

export interface LayoutNavItem {
   label: string;
   route: string;
   icon: string;
   exact?: boolean;
}
