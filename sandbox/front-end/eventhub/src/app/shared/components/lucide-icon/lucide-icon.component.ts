import { Component, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
   selector: 'app-lucide-icon',
   imports: [LucideDynamicIcon],
   templateUrl: './lucide-icon.component.html'
})
export class LucideIconComponent {
   readonly name = input.required<string>();
   readonly size = input<number>(18);
   readonly strokeWidth = input<number>(2);
   readonly iconClass = input<string>('');
}
