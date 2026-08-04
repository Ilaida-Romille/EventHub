import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerLayoutComponent } from './organizer-layout.component';
import { provideRouter } from '@angular/router';
import { NavbarContextService } from '../../core/services/navbar-context.service';

describe('OrganizerLayoutComponent', () => {
  let component: OrganizerLayoutComponent;
  let fixture: ComponentFixture<OrganizerLayoutComponent>;

  // 1. Create a mock for NavbarContextService
  const mockNavbarContextService = {
    updateContext: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: NavbarContextService, useValue: mockNavbarContextService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
