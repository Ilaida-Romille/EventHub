import { Component, input } from '@angular/core';

export interface ChartBar {
   month: string;
   value: string;
   height: string;
}

@Component({
   selector: 'app-analytics-bar-chart',
   standalone: true,
   templateUrl: './analytics-bar-chart.component.html',
   styleUrl: './analytics-bar-chart.component.scss'
})
export class AnalyticsBarChartComponent {
   readonly title = input<string>('Events Distribution per Month');
   readonly bars = input.required<ChartBar[]>();
}
