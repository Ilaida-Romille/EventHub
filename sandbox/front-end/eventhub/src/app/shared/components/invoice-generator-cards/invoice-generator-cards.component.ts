import { Component, input, output } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

export interface InvoiceGeneratorOrganizerOption {
   organizerId: string;
   organizerName: string;
   latestInvoiceNumber: string;
   targetCycle: string;
}

@Component({
   selector: 'app-invoice-generator-cards',
   standalone: true,
   imports: [LucideIconComponent],
   templateUrl: './invoice-generator-cards.component.html',
   styleUrl: './invoice-generator-cards.component.scss'
})
export class InvoiceGeneratorCardsComponent {
   readonly sectionTitle = input<string>('Generate Invoices');
   readonly organizerOptions = input<InvoiceGeneratorOrganizerOption[]>([]);
   readonly selectedOrganizerId = input<string | null>(null);
   readonly selectedTargetCycle = input<string>('MM/YY');
   readonly isOrganizerMenuOpen = input<boolean>(false);

   readonly organizerMenuToggled = output<void>();
   readonly organizerSelected = output<string>();
   readonly generateRequested = output<void>();

   protected readonly selectedOrganizer = () =>
      this.organizerOptions().find((option) => option.organizerId === this.selectedOrganizerId()) ??
      null;

   protected toggleOrganizerMenu(): void {
      this.organizerMenuToggled.emit();
   }

   protected selectOrganizer(organizerId: string): void {
      this.organizerSelected.emit(organizerId);
   }

   protected onGenerateRequested(): void {
      if (!this.selectedOrganizer()) {
         return;
      }

      this.generateRequested.emit();
   }
}
