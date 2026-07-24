import { Component, output, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-modal',
   standalone: true,
   imports: [LucideIconComponent],
   templateUrl: './modal.component.html',
   styleUrl: './modal.component.scss'
})
export class ModalComponent {
   readonly open = input<boolean>(false);
   readonly title = input<string>('Dialog');
   readonly close = output<void>();

   protected closeModal(): void {
      this.close.emit();
   }
}
