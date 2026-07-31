import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { MOCK_EVENTS } from '../../events.mock';
import { Event } from '../../../../core/models/event.model';

export interface Attendee {
   id: string;
   name: string;
   avatar: string;
   role?: string;
}

@Component({
   selector: 'app-event-details',
   standalone: true,
   imports: [RouterLink, DatePipe, HeaderComponent, LucideIconComponent],
   templateUrl: './event-details.component.html',
   styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent {
   private readonly sanitizer = inject(DomSanitizer);

   public readonly event = signal<Event>(MOCK_EVENTS[0]);

   protected readonly attendees = signal<Attendee[]>([
      {
         id: '1',
         name: 'Alex Rivera',
         role: 'Lead Architect',
         avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      },
      {
         id: '2',
         name: 'Sarah Chen',
         role: 'Senior AI Engineer',
         avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
      },
      {
         id: '3',
         name: 'Marcus Vance',
         role: 'Staff Developer',
         avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
      },
      {
         id: '4',
         name: 'Elena Rostova',
         role: 'Principal Researcher',
         avatar:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
      },
      {
         id: '5',
         name: 'David Kim',
         role: 'Product Manager',
         avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      }
   ]);

   protected readonly sanitizedMapUrl = computed<SafeResourceUrl>(() => {
      const venue = encodeURIComponent(this.event().venue);
      const url = `https://maps.google.com/maps?q=${venue}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
   });

   protected readonly capacityPercent = computed(() => {
      const { registered, maximum } = this.event().capacity;
      if (!maximum) return 0;
      return Math.min(100, Math.round((registered / maximum) * 100));
   });

   protected readonly statusLabel = computed(() => {
      switch (this.event().status) {
         case 'registration_open':
            return 'Registration Open';
         case 'registration_closed':
            return 'Registration Closed';
         case 'ongoing':
            return 'Live Now';
         case 'completed':
            return 'Completed';
         default:
            return 'Upcoming';
      }
   });
}
