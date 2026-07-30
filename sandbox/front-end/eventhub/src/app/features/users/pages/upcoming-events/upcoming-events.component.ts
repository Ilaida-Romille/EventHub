import { Component, computed, signal } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import {
   FilterField,
   SearchFilterCardComponent
} from '../../../../shared/components/search-filter-card/search-filter-card.component';
import { CategorySwitchComponent } from '../../../../shared/components/category-switch/category-switch.component';
import {
   ViewMode,
   ViewToggleComponent
} from '../../../../shared/components/view-toggle/view-toggle.component';
import { MOCK_EVENTS } from '../../events.mock';
import { Event } from '../../../../core/models/event.model';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';

@Component({
   selector: 'app-upcoming-events',
   imports: [
      HeaderComponent,
      SearchFilterCardComponent,
      CategorySwitchComponent,
      ViewToggleComponent,
      EventCardComponent
   ],
   templateUrl: './upcoming-events.component.html',
   styleUrl: './upcoming-events.component.scss'
})
export class UpcomingEventsComponent {
   protected readonly activeCategory = signal<string>('Upcoming');
   protected readonly activeView = signal<ViewMode>('grid');
   protected readonly eventsList = signal<Event[]>(MOCK_EVENTS);
   protected readonly filterQuery = signal<string>('');

   protected readonly searchFields = signal<FilterField[]>([
      {
         id: 'search',
         label: 'Search Events',
         type: 'text',
         placeholder: 'Search by title, location...',
         wide: true
      },
      { id: 'startDate', label: 'From Date', type: 'date' },
      { id: 'endDate', label: 'To Date', type: 'date' }
   ]);

   protected readonly filteredEvents = computed(() => {
      const query = this.filterQuery().toLowerCase().trim();
      const category = this.activeCategory();

      return this.eventsList().filter((evt) => {
         const matchesSearch =
            !query ||
            evt.title.toLowerCase().includes(query) ||
            evt.venue.toLowerCase().includes(query);

         if (category === 'Recently Added') {
            return matchesSearch && evt.status === 'registration_open';
         }
         return matchesSearch;
      });
   });

   protected onSearchSubmitted(filters: Record<string, string>): void {
      if (filters['search'] !== undefined) {
         this.filterQuery.set(filters['search']);
      }
   }
}
