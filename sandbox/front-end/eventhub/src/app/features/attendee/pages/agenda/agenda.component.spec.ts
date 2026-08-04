import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AgendaComponent } from './agenda.component';
import { RegistrationService } from '../services/registration.service';
import { EventsDataService } from '../services/events-data.service';
import { NavbarContextService } from '../../../core/services/navbar-context.service';
import { EventDetail, RegisteredAttendee } from '../models/attendee.model';

describe('AgendaComponent', () => {
  let component: AgendaComponent;
  let fixture: ComponentFixture<AgendaComponent>;

  // 1. Define mock data matching your models
  const mockEventDetail: EventDetail = {
    id: 'evt-101',
    title: 'Sample Tech Event',
    agenda: []
  } as unknown as EventDetail;

  const mockAttendees: RegisteredAttendee[] = [];

  // 2. Create mock services with Vitest spies
  const mockActivatedRoute = {
    paramMap: of(new Map([['eventId', 'evt-101']]))
  };

  const mockEventsDataService = {
    getEventById: vi.fn().mockReturnValue(of(mockEventDetail))
  };

  const mockRegistrationService = {
    getRegistrationsByEventId: vi.fn().mockReturnValue(of(mockAttendees))
  };

  const mockNavbarContextService = {
    setEventName: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: EventsDataService, useValue: mockEventsDataService },
        { provide: RegistrationService, useValue: mockRegistrationService },
        { provide: NavbarContextService, useValue: mockNavbarContextService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaComponent);
    component = fixture.componentInstance;
  });

  it('should create and load event details on init', async () => {
    fixture.detectChanges(); // Triggers ngOnInit()
    await fixture.whenStable();

    expect(component).toBeTruthy();
    expect(component.eventId).toBe('evt-101');
    expect(mockEventsDataService.getEventById).toHaveBeenCalledWith('evt-101');
    expect(mockRegistrationService.getRegistrationsByEventId).toHaveBeenCalledWith('evt-101');
    expect(mockNavbarContextService.setEventName).toHaveBeenCalledWith('Sample Tech Event');
  });
});