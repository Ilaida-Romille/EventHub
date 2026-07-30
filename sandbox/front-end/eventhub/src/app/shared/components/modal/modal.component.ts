import { Component, output, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-modal',
   imports: [LucideIconComponent],
   templateUrl: './modal.component.html',
   styleUrl: './modal.component.scss'
})
export class ModalComponent {
   readonly open = input<boolean>(false);
   readonly title = input<string>('Dialog');
   readonly closed = output<void>();

   protected closeModal(): void {
      this.closed.emit();
   }

   onBackdropClick(event: MouseEvent): void {
      if (event.target === event.currentTarget) {
         this.closeModal();
      }
   }
}
