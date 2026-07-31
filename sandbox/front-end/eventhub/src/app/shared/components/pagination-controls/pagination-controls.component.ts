import { Component, input, output } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-pagination-controls',
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

   readonly isFirstPage = input<boolean>(false);
   readonly isLastPage = input<boolean>(false);

   readonly prevClick = output<void>();
   readonly nextClick = output<void>();

   protected onPrev(event: MouseEvent): void {
      event.preventDefault();
      if (!this.isFirstPage()) {
         this.prevClick.emit();
      }
   }

   protected onNext(event: MouseEvent): void {
      event.preventDefault();
      if (!this.isLastPage()) {
         this.nextClick.emit();
      }
   }
}
