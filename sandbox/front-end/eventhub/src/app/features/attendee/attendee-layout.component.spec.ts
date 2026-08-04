import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeLayoutComponent } from './attendee-layout.component';

describe('AttendeeLayoutComponent', () => {
  let component: AttendeeLayoutComponent;
  let fixture: ComponentFixture<AttendeeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttendeeLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
