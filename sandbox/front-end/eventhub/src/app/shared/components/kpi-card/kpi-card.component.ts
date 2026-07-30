import { Component, input } from '@angular/core';

@Component({
   selector: 'app-kpi-card',
   templateUrl: './kpi-card.component.html',
   styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
   readonly value = input.required<string>();
   readonly label = input.required<string>();
}
