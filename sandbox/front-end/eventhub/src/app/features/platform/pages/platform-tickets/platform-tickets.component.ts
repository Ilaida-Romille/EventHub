import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { TicketTableRow } from '../../../../core/models/platform.models';
import { PlatformDataService } from '../../../../core/services/platform-data.service';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-platform-tickets',
   standalone: true,
   imports: [PlatformLayoutComponent, LucideIconComponent],
   templateUrl: './platform-tickets.component.html',
   styleUrl: './platform-tickets.component.scss'
})
export class PlatformTicketsComponent {
   private readonly platformDataService = inject(PlatformDataService);

   private readonly ticketRows = toSignal(this.platformDataService.getTicketRows(), {
      initialValue: [] as TicketTableRow[]
   });

   protected readonly selectedTicketId = signal<string | null>(null);

   protected readonly tickets = computed(() => this.ticketRows());

   protected readonly selectedTicket = computed(() => {
      const tickets = this.tickets();
      const selectedId = this.selectedTicketId();

      if (!tickets.length) {
         return null;
      }

      return tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0] ?? null;
   });

   protected readonly queueCount = computed(() => this.tickets().length);

   constructor() {
      this.initializeSelection();
   }

   protected selectTicket(ticketId: string): void {
      this.selectedTicketId.set(ticketId);
   }

   protected resolveTicketTime(createdAt: string): string {
      const createdDate = new Date(createdAt);

      if (Number.isNaN(createdDate.getTime())) {
         return 'opened recently';
      }

      const diffMs = Math.max(0, Date.now() - createdDate.getTime());
      const hourMs = 60 * 60 * 1000;
      const dayMs = 24 * hourMs;

      if (diffMs < hourMs) {
         return 'opened recently';
      }

      if (diffMs < dayMs) {
         const hours = Math.max(1, Math.floor(diffMs / hourMs));
         return hours === 1 ? 'opened 1 hour ago' : `opened ${hours} hours ago`;
      }

      const days = Math.floor(diffMs / dayMs);
      return days === 1 ? 'opened 1 day ago' : `opened ${days} days ago`;
   }

   private initializeSelection(): void {
      const firstTicket = this.ticketRows()[0];

      if (firstTicket) {
         this.selectedTicketId.set(firstTicket.id);
      }
   }
}
