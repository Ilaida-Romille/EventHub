import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewMode } from '../view-toggle/view-toggle.component';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

export interface EventItem {
   id: string;
   title: string;
   category: string;
   date: string;
   venue: string;
   venueLimit: number;
   registeredCount: number;
   imageUrl: string;
   description: string;
   organizer: string;
   isRecentlyAdded?: boolean;
}

@Component({
   selector: 'app-event-card',
   standalone: true,
   imports: [RouterLink, LucideIconComponent],
   templateUrl: './event-card.component.html',
   styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
   readonly event = input.required<EventItem>();
   readonly view = input<ViewMode>('grid');

   protected readonly isFlipped = signal<boolean>(false);
   protected readonly isExpanded = signal<boolean>(false);

   protected toggleFlip(event?: Event): void {
      if (event) event.stopPropagation();
      this.isFlipped.update((v) => !v);
   }

   protected toggleDetails(event?: Event): void {
      if (event) event.stopPropagation();
      this.isExpanded.update((v) => !v);
   }
}
