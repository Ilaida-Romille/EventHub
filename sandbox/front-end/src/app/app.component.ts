import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LandingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected readonly title = signal('front-end');
}
