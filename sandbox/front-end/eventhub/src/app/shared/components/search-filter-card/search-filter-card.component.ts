import { Component, input, output } from '@angular/core';

interface FilterFieldOption {
   label: string;
   value: string;
}

export interface FilterField {
   id: string;
   label: string;
   type: 'text' | 'month' | 'date' | 'select';
   placeholder?: string;
   options?: FilterFieldOption[];
   wide?: boolean;
}

@Component({
   selector: 'app-search-filter-card',
   standalone: true,
   templateUrl: './search-filter-card.component.html',
   styleUrl: './search-filter-card.component.scss'
})
export class SearchFilterCardComponent {
   readonly fields = input.required<FilterField[]>();
   readonly actionLabel = input<string>('Search');
   readonly actionId = input<string>('shared-filter-search-btn');
   readonly initialValues = input<Record<string, string>>({});
   readonly filtersSubmitted = output<Record<string, string>>();

   protected getInitialValue(fieldId: string): string {
      return this.initialValues()[fieldId] ?? '';
   }

   protected onSubmit(event: SubmitEvent): void {
      event.preventDefault();

      const target = event.target;
      if (!(target instanceof HTMLFormElement)) {
         return;
      }

      const formData = new FormData(target);
      const values: Record<string, string> = {};

      for (const [key, value] of formData.entries()) {
         values[key] = String(value).trim();
      }

      this.filtersSubmitted.emit(values);
   }
}
