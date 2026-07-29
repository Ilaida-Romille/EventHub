import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySwitchComponent } from './category-switch.component';

describe('CategorySwitchComponent', () => {
   let component: CategorySwitchComponent;
   let fixture: ComponentFixture<CategorySwitchComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [CategorySwitchComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(CategorySwitchComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
