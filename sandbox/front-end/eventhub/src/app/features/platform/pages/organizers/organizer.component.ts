import { Component } from '@angular/core';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { PaginationControlsComponent } from '../../../../shared/components/pagination-controls/pagination-controls.component';

@Component({
   selector: 'app-organizer',
   standalone: true,
   imports: [PlatformLayoutComponent, PaginationControlsComponent],
   templateUrl: './organizer.component.html',
   styleUrl: './organizer.component.scss'
})
export class OrganizerComponent {}
