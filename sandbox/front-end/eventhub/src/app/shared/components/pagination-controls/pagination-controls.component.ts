import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-pagination-controls',
   standalone: true,
   imports: [LucideIconComponent],
   templateUrl: './pagination-controls.component.html',
   styleUrl: './pagination-controls.component.scss'
})
export class PaginationControlsComponent {
   readonly prevId = input.required<string>();
   readonly nextId = input.required<string>();
   readonly indicatorId = input.required<string>();
   readonly indicatorText = input<string>('Page 1 of 1');
   readonly align = input<'start' | 'center' | 'end'>('end');
   readonly withBottomMargin = input<boolean>(false);
}
