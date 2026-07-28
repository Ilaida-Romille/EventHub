import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutNavItem } from '../../../core/models/layout.models';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

const DEFAULT_PLATFORM_NAV_ITEMS: LayoutNavItem[] = [
   { label: 'Item 1', route: '/#', icon: 'circle-question-mark', exact: true },
   { label: 'Item 2', route: '/#', icon: 'circle-question-mark' },
   { label: 'Item 3', route: '/#', icon: 'circle-question-mark' },
   { label: 'Item 4', route: '/#', icon: 'circle-question-mark' }
];

@Component({
   selector: 'app-mobile-bottom-nav',
   standalone: true,
   imports: [RouterLink, RouterLinkActive, LucideIconComponent],
   templateUrl: './mobile-bottom-nav.component.html',
   styleUrl: './mobile-bottom-nav.component.scss'
})
export class MobileBottomNavComponent {
   readonly navItems = input<LayoutNavItem[]>(DEFAULT_PLATFORM_NAV_ITEMS);
}
