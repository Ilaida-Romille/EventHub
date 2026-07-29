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
import {
   EventCardComponent,
   EventItem
} from '../../../../shared/components/event-card/event-card.component';

@Component({
   selector: 'app-upcoming-events',
   standalone: true,
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

   protected readonly searchFields = signal<FilterField[]>([
      {
         id: 'search',
         label: 'Search Events',
         type: 'text',
         placeholder: 'Type keywords...',
         wide: true
      },
      {
         id: 'category',
         label: 'Category',
         type: 'select',
         options: [
            { label: 'All Categories', value: '' },
            { label: 'Tech & Innovation', value: 'Tech & Innovation' },
            { label: 'Corporate', value: 'Corporate' },
            { label: 'Social Gatherings', value: 'Social Gatherings' }
         ]
      },
      { id: 'startDate', label: 'From Date', type: 'date' },
      { id: 'endDate', label: 'To Date', type: 'date' }
   ]);

   protected readonly eventCards = signal<EventItem[]>([
      {
         id: '1',
         title: 'Tech Summit 2026',
         date: 'Aug 15, 2026',
         venue: 'Makati Convention Center',
         venueLimit: 500,
         category: 'Tech & Innovation',
         registeredCount: 342,
         imageUrl:
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop',
         description:
            'Join industry pioneers exploring breakthrough technology in AI, cloud engineering, and quantum computing.',
         organizer: 'Tech Alliance PH'
      },
      {
         id: '2',
         title: 'Corporate Leaders Forum',
         date: 'Sep 02, 2026',
         venue: 'BGC Conference Hall',
         venueLimit: 200,
         category: 'Corporate',
         registeredCount: 185,
         imageUrl:
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop',
         description:
            'An exclusive networking event gathering executive leaders to discuss sustainable business practices and global market trends.',
         organizer: 'Global Biz Network'
      },
      {
         id: '3',
         title: 'Community Connect Social',
         date: 'Sep 18, 2026',
         venue: 'Quezon City Expo Grounds',
         venueLimit: 600,
         category: 'Social Gatherings',
         registeredCount: 520,
         imageUrl:
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop',
         description:
            'A vibrant outdoor social gathering celebrating local culture, live music, artisanal markets, and community projects.',
         organizer: 'QC Civic Association',
         isRecentlyAdded: true
      }
   ]);

   protected readonly filteredEvents = computed(() => {
      const category = this.activeCategory();
      const events = this.eventCards();

      if (category === 'Recently Added') {
         return events.filter((e) => e.isRecentlyAdded);
      }
      return events;
   });

   protected onSearchSubmitted(filters: Record<string, string>): void {
      console.log('Filters applied:', filters);
   }
}
