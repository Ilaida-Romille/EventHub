import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerComponent } from './organizer.component';

describe('OrganizerComponent', () => {
   let component: OrganizerComponent;
   let fixture: ComponentFixture<OrganizerComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [OrganizerComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(OrganizerComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
