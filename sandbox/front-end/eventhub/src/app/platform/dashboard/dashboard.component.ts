import { Component } from '@angular/core';
import { TopbarComponent } from '../../shared/topbar/topbar.component';

@Component({
   selector: 'app-dashboard',
   imports: [TopbarComponent],
   templateUrl: './dashboard.component.html',
   styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}
