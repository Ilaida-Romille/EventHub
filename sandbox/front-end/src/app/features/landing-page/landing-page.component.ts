import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  // Make sure you *do not* import a local CSS/SCSS file here 
  // if you only want to test global styles.
  templateUrl: './landing-page.component.html',
  // styleUrls: [] 
})
export class LandingPageComponent { }