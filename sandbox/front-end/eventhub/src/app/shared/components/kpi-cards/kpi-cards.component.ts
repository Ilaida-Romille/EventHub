import { Component, input } from '@angular/core';

export interface KpiCard {
   value: string;
   label: string;
}

@Component({
   selector: 'app-kpi-cards',
   standalone: true,
   templateUrl: './kpi-cards.component.html',
   styleUrl: './kpi-cards.component.scss'
})
export class KpiCardsComponent {
   readonly cards = input.required<KpiCard[]>();
}
