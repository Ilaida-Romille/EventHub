import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { MOCK_EVENTS } from '../../events.mock';
import { Event } from '../../../../core/models/event.model';

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

   protected readonly isRegistrationOpen = computed(() => {
      return (
         this.event().status === 'registration_open' &&
         this.event().capacity.registered < this.event().capacity.maximum
      );
   });

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
         case 'cancelled':
            return 'Cancelled';
         default:
            return 'Upcoming';
      }
   });
}
