import { Component, input, output } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

export type ViewMode = 'grid' | 'list';

@Component({
   selector: 'app-view-toggle',
   imports: [LucideIconComponent],
   templateUrl: './view-toggle.component.html',
   styleUrl: './view-toggle.component.scss'
})
export class ViewToggleComponent {
   readonly view = input<ViewMode>('grid');
   readonly viewChange = output<ViewMode>();

   protected setView(mode: ViewMode): void {
      if (mode !== this.view()) {
         this.viewChange.emit(mode);
      }
   }
}
