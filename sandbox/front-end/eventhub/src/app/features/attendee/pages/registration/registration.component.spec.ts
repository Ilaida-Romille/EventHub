import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RegistrationComponent, corporateEmailValidator } from './registration.component';
import { EventsDataService } from '../services/events-data.service';
import { RegistrationService } from '../services/registration.service';
import { NavbarContextService } from '../../../core/services/navbar-context.service';
import { SessionService } from '../../../core/services/session.service';
import { EventDetail } from '../models/attendee.model';
import { FormControl } from '@angular/forms';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  // 1. Mock Data
  const mockEventDetail: EventDetail = {
    id: 'evt-101',
    title: 'Sample Event',
    status: 'registration_open'
  } as unknown as EventDetail;

  const mockSession = {
    user: { name: 'John Doe', email: 'john.doe@company.com' }
  };

  // 2. Mock Services
  const mockActivatedRoute = {
    paramMap: of(new Map([['id', 'evt-101']]))
  };

  const mockEventsDataService = {
    getEventById: vi.fn().mockReturnValue(of(mockEventDetail))
  };

  const mockRegistrationService = {
    isEmailRegisteredForEvent: vi.fn().mockReturnValue(false),
    registerAttendee: vi.fn()
  };

  const mockNavbarContextService = {
    setCurrentPage: vi.fn(),
    setEventName: vi.fn()
  };

  const mockSessionService = {
    getCurrentSession: vi.fn().mockReturnValue(mockSession)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: EventsDataService, useValue: mockEventsDataService },
        { provide: RegistrationService, useValue: mockRegistrationService },
        { provide: NavbarContextService, useValue: mockNavbarContextService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
  });

  it('should create and prefill user session info', () => {
    fixture.detectChanges(); // Triggers ngOnInit() safely

    expect(component).toBeTruthy();
    expect(component.eventId).toBe('evt-101');
    expect(component.registrationForm.value.fullName).toBe('John Doe');
    expect(component.registrationForm.value.emailAddress).toBe('john.doe@company.com');
  });

  it('should reject public email domains in corporateEmailValidator', () => {
    const control = new FormControl('test@gmail.com');
    const result = corporateEmailValidator(control);

    expect(result).toEqual({ publicEmailNotAllowed: true });
  });

  it('should submit valid form and navigate', () => {
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.registrationForm.patchValue({
      fullName: 'John Doe',
      emailAddress: 'john.doe@corporate.com',
      companyDept: 'Engineering',
      dietary: 'None',
      additionalNotes: 'N/A'
    });

    component.onSubmit();

    expect(mockRegistrationService.registerAttendee).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalled();
  });
});