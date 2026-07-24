import { Component } from '@angular/core';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { PaginationControlsComponent } from '../../../../shared/components/pagination-controls/pagination-controls.component';

@Component({
   selector: 'app-tickets',
   standalone: true,
   imports: [PlatformLayoutComponent, LucideIconComponent, PaginationControlsComponent],
   templateUrl: './tickets.component.html',
   styleUrl: './tickets.component.scss'
})
export class TicketsComponent {}
