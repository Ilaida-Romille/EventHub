import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformOrganizersComponent } from './platform-organizers.component';

describe('PlatformOrganizersComponent', () => {
   let component: PlatformOrganizersComponent;
   let fixture: ComponentFixture<PlatformOrganizersComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [PlatformOrganizersComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(PlatformOrganizersComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
