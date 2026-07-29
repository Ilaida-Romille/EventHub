import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { PlatformDataService } from '../../../../core/services/platform-data.service';
import { AnalyticsBarChartComponent } from '../../../../shared/components/analytics-bar-chart/analytics-bar-chart.component';
import { KpiCardComponent } from '../../../../shared/components/kpi-card/kpi-card.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
export interface DashboardShortcut {
   label: string;
   routerLink: string;
   icon?: string;
}
@Component({
   selector: 'app-platform-dashboard',
   standalone: true,
   imports: [
      RouterLink,
      PlatformLayoutComponent,
      LucideIconComponent,
      KpiCardComponent,
      AnalyticsBarChartComponent
   ],
   templateUrl: './platform-dashboard.component.html',
   styleUrl: './platform-dashboard.component.scss'
})
export class PlatformDashboardComponent {
   private readonly platformDataService = inject(PlatformDataService);

   private readonly organizations = toSignal(this.platformDataService.getOrganizations(), {
      initialValue: []
   });
   private readonly events = toSignal(this.platformDataService.getEvents(), {
      initialValue: []
   });
   private readonly analytics = toSignal(this.platformDataService.getAnalytics(), {
      initialValue: { monthlyEventVolume: [] }
   });

   protected readonly kpiCards = computed(() => [
      { value: `${this.organizations().length.toLocaleString()}`, label: 'Total Organizers' },
      { value: `${this.events().length.toLocaleString()}`, label: 'Total Events (This Year)' }
   ]);

   protected readonly analyticsBars = computed(() => {
      const monthlyVolume = this.analytics().monthlyEventVolume;
      const maxCount = Math.max(...monthlyVolume.map((item) => item.count), 1);

      return monthlyVolume.map((item) => ({
         month: item.month,
         value: item.count.toLocaleString(),
         height: `${Math.round((item.count / maxCount) * 100)}%`
      }));
   });

   readonly shortcuts = signal<DashboardShortcut[]>([
      { label: 'View Organizers', routerLink: '/platform/organizers', icon: 'arrow-right' },
      { label: 'View Billing', routerLink: '/platform/billing', icon: 'arrow-right' },
      { label: 'View Tickets', routerLink: '/platform/tickets', icon: 'arrow-right' }
   ]);
}
