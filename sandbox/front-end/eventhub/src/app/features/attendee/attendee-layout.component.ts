import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-attendee-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './attendee-layout.component.html',
  styleUrl: './attendee-layout.component.css',
})
export class AttendeeLayoutComponent {

}