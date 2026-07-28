import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MobileBottomNavComponent } from '../../../shared/components/mobile-bottom-nav/mobile-bottom-nav.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
   selector: 'app-platform-layout',
   standalone: true,
   imports: [SidebarComponent, HeaderComponent, MobileBottomNavComponent],
   templateUrl: './platform-layout.component.html',
   styleUrl: './platform-layout.component.scss'
})
export class PlatformLayoutComponent {
   private readonly destroyRef = inject(DestroyRef);

   readonly profileName = input<string>('John Dela Cruz');
   readonly profileRole = input<string>('Platform Owner');
   readonly fluidContent = input<boolean>(false);

   protected readonly isMobile = signal<boolean>(false);
   protected readonly collapsed = signal<boolean>(false);
   protected readonly showCollapsedSidebar = computed<boolean>(
      () => !this.isMobile() && this.collapsed()
   );

   constructor() {
      this.initializeViewportWatcher();
   }

   private initializeViewportWatcher(): void {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
         return;
      }

      const mediaQuery = window.matchMedia('(max-width: 992px)');
      const syncViewportState = (matches: boolean): void => {
         this.isMobile.set(matches);
      };

      syncViewportState(mediaQuery.matches);

      const handleViewportChange = (event: MediaQueryListEvent): void => {
         syncViewportState(event.matches);
      };

      mediaQuery.addEventListener('change', handleViewportChange);
      this.destroyRef.onDestroy(() => {
         mediaQuery.removeEventListener('change', handleViewportChange);
      });
   }
}
