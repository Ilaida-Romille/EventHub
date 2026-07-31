import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-search-bar',
   standalone: true,
   imports: [CommonModule, LucideIconComponent],
   templateUrl: './search-bar.component.html',
   styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
   @Output() search = new EventEmitter<string>();

   protected readonly query = signal<string>('');

   onInput(event: Event): void {
      const value = (event.target as HTMLInputElement).value;
      this.query.set(value);
   }

   onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Enter') {
         this.triggerSearch();
      }
   }

   triggerSearch(): void {
      this.search.emit(this.query());
   }
}
