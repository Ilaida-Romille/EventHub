import { Component, signal } from '@angular/core';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { PaginationControlsComponent } from '../../../../shared/components/pagination-controls/pagination-controls.component';

@Component({
   selector: 'app-billing',
   standalone: true,
   imports: [
      PlatformLayoutComponent,
      LucideIconComponent,
      ModalComponent,
      PaginationControlsComponent
   ],
   templateUrl: './billing.component.html',
   styleUrl: './billing.component.scss'
})
export class BillingComponent {
   protected readonly isInvoicePreviewOpen = signal<boolean>(false);

   protected openInvoicePreview(): void {
      this.isInvoicePreviewOpen.set(true);
   }

   protected closeInvoicePreview(): void {
      this.isInvoicePreviewOpen.set(false);
   }
}
