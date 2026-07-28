import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { AnalyticsBarChartComponent } from '../../../../shared/components/analytics-bar-chart/analytics-bar-chart.component';
import { KpiCardsComponent } from '../../../../shared/components/kpi-cards/kpi-cards.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [
      RouterLink,
      PlatformLayoutComponent,
      LucideIconComponent,
      KpiCardsComponent,
      AnalyticsBarChartComponent
   ],
   templateUrl: './dashboard.component.html',
   styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
   protected readonly kpiCards = [
      { value: '2,031', label: 'Total Organizers' },
      { value: '19,230', label: 'Total Events (This Year)' }
   ];

   protected readonly analyticsBars = [
      { month: 'Jan', value: '1,125', height: '45%' },
      { month: 'Feb', value: '1,625', height: '65%' },
      { month: 'Mar', value: '2,000', height: '80%' },
      { month: 'Apr', value: '1,375', height: '55%' },
      { month: 'May', value: '2,250', height: '90%' },
      { month: 'Jun', value: '1,750', height: '70%' },
      { month: 'Jul', value: '2,125', height: '85%' },
      { month: 'Aug', value: '1,500', height: '60%' },
      { month: 'Sep', value: '1,875', height: '75%' },
      { month: 'Oct', value: '1,250', height: '50%' },
      { month: 'Nov', value: '2,375', height: '95%' },
      { month: 'Dec', value: '1,000', height: '40%' }
   ];
}
