import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatformLayoutComponent } from '../../../../core/layouts/platform-layout/platform-layout.component';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [RouterLink, PlatformLayoutComponent, LucideIconComponent],
   templateUrl: './dashboard.component.html',
   styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}
