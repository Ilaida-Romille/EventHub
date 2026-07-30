import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { MOCK_EVENTS } from '../../events.mock';
import { Event } from '../../../../core/models/event.model';

@Component({
   selector: 'app-event-registration',
   standalone: true,
   imports: [RouterLink, DatePipe, HeaderComponent, ReactiveFormsModule, LucideIconComponent],
   templateUrl: './event-registration.component.html',
   styleUrl: './event-registration.component.scss'
})
export class EventRegistrationComponent {
   private readonly fb = inject(FormBuilder);
   private readonly sanitizer = inject(DomSanitizer);

   public readonly event = signal<Event>(MOCK_EVENTS[0]);
   public readonly isSubmitted = signal<boolean>(false);

   /** Sanitized Google Maps Embed URL for Venue */
   protected readonly sanitizedMapUrl = computed<SafeResourceUrl>(() => {
      const venue = encodeURIComponent(this.event().venue);
      const url = `https://maps.google.com/maps?q=${venue}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
   });

   protected readonly isCapacityFull = computed(() => {
      const { registered, maximum } = this.event().capacity;
      return registered >= maximum;
   });

   protected readonly capacityPercent = computed(() => {
      const { registered, maximum } = this.event().capacity;
      if (!maximum) return 0;
      return Math.min(100, Math.round((registered / maximum) * 100));
   });

   protected readonly registrationForm = this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      dietary: [''],
      notes: ['']
   });

   protected onSubmit(): void {
      if (this.registrationForm.valid && !this.isCapacityFull()) {
         this.event.update((evt) => ({
            ...evt,
            capacity: {
               ...evt.capacity,
               registered: evt.capacity.registered + 1
            }
         }));
         this.isSubmitted.set(true);
      } else {
         this.registrationForm.markAllAsTouched();
      }
   }
}
