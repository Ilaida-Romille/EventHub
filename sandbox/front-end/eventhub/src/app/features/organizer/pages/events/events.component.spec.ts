import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizerEventsComponent } from './events.component';
import { OrganizerEventsApiService } from './services/organizer-events-api.service';
import { Event } from './models/event.model';

describe('OrganizerEventsComponent', () => {
  let component: OrganizerEventsComponent;
  let fixture: ComponentFixture<OrganizerEventsComponent>;
  let mockApiService: Partial<Record<keyof OrganizerEventsApiService, ReturnType<typeof vi.fn>>>;

  const mockEventsList: Event[] = [
    {
      id: 'evt-1',
      title: 'Angular Conf',
      description: 'Angular summit',
      organizerId: 'org-1',
      organizerName: 'DevOrg',
      status: 'registration_open',
      startDateTime: '2026-10-10T10:00:00Z',
      endDateTime: '2026-10-10T18:00:00Z',
      registrationOpensAt: '2026-09-01T00:00:00Z',
      registrationClosesAt: '2026-10-09T23:59:59Z',
      venue: 'Convention Center',
      bannerImageUrl: '',
      capacity: { maximum: 200, registered: 50 },
      agenda: []
    }
  ];

  beforeEach(async () => {
    mockApiService = {
      getEvents: vi.fn().mockReturnValue(of(mockEventsList)),
      getEventById: vi.fn(),
      createEvent: vi.fn(),
      updateEvent: vi.fn(),
      deleteEvent: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [OrganizerEventsComponent],
      providers: [
        { provide: OrganizerEventsApiService, useValue: mockApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerEventsComponent);
    component = fixture.componentInstance;
  });

  it('should initialize and load events on ngOnInit', () => {
    fixture.detectChanges(); // Trigger ngOnInit

    expect(mockApiService.getEvents).toHaveBeenCalledTimes(1);
    expect(component.events.length).toBe(1);
    expect(component.organizerOptions).toContain('DevOrg');
    expect(component.isLoading).toBe(false);
  });

  it('should handle API errors when loading events', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Server connection failed' },
      status: 500
    });
    mockApiService.getEvents?.mockReturnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(component.dataLoadingError).toBe('Server connection failed');
    expect(component.events).toEqual([]);
  });

  it('should filter events based on search term', () => {
    component.events = mockEventsList;
    component.searchTerm = 'Angular';
    component.applyFilters();

    expect(component.filteredEvents.length).toBe(1);

    component.searchTerm = 'Nonexistent';
    component.applyFilters();

    expect(component.filteredEvents.length).toBe(0);
  });

  describe('Wizard Navigation & Form Validation', () => {
    beforeEach(() => {
      component.openAddEventModal();
    });

    it('should open modal and reset to step 1', () => {
      expect(component.isModalOpen).toBe(true);
      expect(component.wizardStep).toBe(1);
      expect(component.isEditMode).toBe(false);
    });

    it('should block navigation to Step 2 if Step 1 fields are empty', () => {
      component.wizardStep = 1;
      component.formData.title = '';
      component.formData.description = '';

      component.nextStep();

      expect(component.wizardStep).toBe(1);
      expect(component.formError).toBe('Event title and description are required.');
    });

    it('should advance to Step 2 if Step 1 fields are valid', () => {
      component.formData.title = 'New Event';
      component.formData.description = 'Description';

      component.nextStep();

      expect(component.wizardStep).toBe(2);
      expect(component.formError).toBe('');
    });
  });

  describe('Event Operations', () => {
    it('should trigger delete API on confirmDelete()', () => {
      mockApiService.deleteEvent?.mockReturnValue(of(undefined));
      component.events = [...mockEventsList];
      component.openDeleteConfirm(mockEventsList[0]);

      component.confirmDelete();

      expect(mockApiService.deleteEvent).toHaveBeenCalledWith('evt-1');
      expect(component.events.length).toBe(0);
      expect(component.showToastNotif).toBe(true);
    });

    it('should add and remove agenda items in the form', () => {
      expect(component.formData.agenda.length).toBe(0);

      component.addAgendaItem();
      expect(component.formData.agenda.length).toBe(1);

      component.removeAgendaItem(0);
      expect(component.formData.agenda.length).toBe(0);
    });
  });
});