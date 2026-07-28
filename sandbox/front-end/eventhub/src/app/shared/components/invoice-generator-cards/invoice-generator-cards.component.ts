import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-invoice-generator-cards',
   standalone: true,
   imports: [LucideIconComponent],
   templateUrl: './invoice-generator-cards.component.html',
   styleUrl: './invoice-generator-cards.component.scss'
})
export class InvoiceGeneratorCardsComponent {
   readonly sectionTitle = input<string>('Generate Invoices');
}
