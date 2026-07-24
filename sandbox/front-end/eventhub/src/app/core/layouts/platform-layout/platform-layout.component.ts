import { Component, input, signal } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
   selector: 'app-platform-layout',
   standalone: true,
   imports: [SidebarComponent],
   templateUrl: './platform-layout.component.html',
   styleUrl: './platform-layout.component.scss'
})
export class PlatformLayoutComponent {
   readonly title = input.required<string>();
   readonly subtitle = input.required<string>();
   readonly profileName = input<string>('John Dela Cruz');
   readonly profileRole = input<string>('Platform Owner');

   protected readonly collapsed = signal<boolean>(false);

   protected onSidebarCollapsedChange(isCollapsed: boolean): void {
      this.collapsed.set(isCollapsed);
   }
}
