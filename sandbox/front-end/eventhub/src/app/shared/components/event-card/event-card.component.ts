import { Component, computed, input, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../../core/models/event.model';
import { ViewMode } from '../view-toggle/view-toggle.component';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-event-card',
   imports: [RouterLink, DatePipe, NgOptimizedImage, LucideIconComponent],
   templateUrl: './event-card.component.html',
   styleUrl: './event-card.component.scss',
   host: {
      '[class.card-grid-host]': "view() === 'grid'",
      '[class.card-list-host]': "view() === 'list'"
   }
})
export class EventCardComponent {
   public readonly event = input.required<Event>();

   public readonly view = input<ViewMode>('grid');

   protected readonly isFlipped = signal<boolean>(false);

   protected readonly isExpanded = signal<boolean>(false);

   protected readonly capacityPercent = computed(() => {
      const { registered, maximum } = this.event().capacity;
      if (!maximum) return 0;
      return Math.min(100, Math.round((registered / maximum) * 100));
   });

   protected readonly isSoldOut = computed(() => {
      const { registered, maximum } = this.event().capacity;
      return registered >= maximum;
   });

   protected readonly canRegister = computed(() => {
      return this.event().status === 'registration_open' && !this.isSoldOut();
   });

   protected readonly statusLabel = computed(() => {
      switch (this.event().status) {
         case 'registration_open':
            return 'Open';
         case 'registration_closed':
            return 'Closed';
         case 'ongoing':
            return 'Live Now';
         case 'completed':
            return 'Completed';
         case 'cancelled':
            return 'Cancelled';
         case 'draft':
            return 'Draft';
         default:
            return 'Upcoming';
      }
   });

   protected toggleFlip(mouseEvent?: MouseEvent): void {
      if (mouseEvent) mouseEvent.stopPropagation();
      this.isFlipped.update((v) => !v);
   }

   protected toggleDetails(mouseEvent?: MouseEvent): void {
      if (mouseEvent) mouseEvent.stopPropagation();
      this.isExpanded.update((v) => !v);
   }
}
