import { Component, input } from '@angular/core';
import { PlatformLayoutComponent } from '../platform-layout/platform-layout.component';

@Component({
   selector: 'app-organizer-layout',
   standalone: true,
   imports: [PlatformLayoutComponent],
   templateUrl: './organizer-layout.component.html',
   styleUrl: './organizer-layout.component.scss'
})
export class OrganizerLayoutComponent {
   readonly profileName = input<string>('Jane Dela Cruz');
   readonly profileRole = input<string>('Organizer Admin');
   readonly fluidContent = input<boolean>(false);
}
