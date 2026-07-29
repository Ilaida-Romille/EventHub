import { Component, input, output } from '@angular/core';

@Component({
   selector: 'app-category-switch',
   imports: [],
   templateUrl: './category-switch.component.html',
   styleUrl: './category-switch.component.scss'
})
export class CategorySwitchComponent {
   readonly tabs = input.required<string[]>();
   readonly selectedTab = input.required<string>();
   readonly tabChange = output<string>();

   protected selectTab(tab: string): void {
      if (tab !== this.selectedTab()) {
         this.tabChange.emit(tab);
      }
   }
}
