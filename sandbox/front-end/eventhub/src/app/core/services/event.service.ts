import { inject, signal, computed, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Event, EventPatchRequest, EventQueryParams } from '../models/event.model';
import { PagedResponse, ErrorResponse } from '../models/common.model';

@Service()
export class EventService {
   private readonly http = inject(HttpClient);
   private readonly baseUrl = '/api/events';

   // State Signals
   readonly events = signal<Event[]>([]);
   readonly selectedEvent = signal<Event | null>(null);
   readonly totalElements = signal<number>(0);
   readonly totalPages = signal<number>(0);
   readonly currentPage = signal<number>(0);
   readonly loading = signal<boolean>(false);
   readonly error = signal<string | null>(null);

   // Derived Computed State
   readonly hasEvents = computed(() => this.events().length > 0);
   readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);

   /**
    * Fetches a paginated/filtered list of events and updates local state signals.
    */
   getEvents(params?: EventQueryParams): Observable<PagedResponse<Event>> {
      this.loading.set(true);
      this.error.set(null);

      let httpParams = new HttpParams();
      if (params) {
         Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
               httpParams = httpParams.set(key, String(value));
            }
         });
      }

      return this.http.get<PagedResponse<Event>>(this.baseUrl, { params: httpParams }).pipe(
         tap((response) => {
            this.events.set(response.content ?? []);
            this.totalElements.set(response.totalElements ?? 0);
            this.totalPages.set(response.totalPages ?? 0);
            this.currentPage.set(response.page ?? 0);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   /**
    * Fetches a single event by ID and updates the selectedEvent signal.
    */
   getEventById(id: string): Observable<Event> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.get<Event>(`${this.baseUrl}/${id}`).pipe(
         tap((event) => {
            this.selectedEvent.set(event);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   /**
    * Creates a new event and prepends it to the active events state.
    */
   createEvent(event: Event): Observable<Event> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.post<Event>(this.baseUrl, event).pipe(
         tap((newEvent) => {
            this.events.update((list) => [newEvent, ...list]);
            this.totalElements.update((count) => count + 1);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   /**
    * Fully replaces an existing event by ID.
    */
   updateEvent(id: string, event: Event): Observable<Event> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.put<Event>(`${this.baseUrl}/${id}`, event).pipe(
         tap((updated) => {
            this.updateLocalEvent(id, updated);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   /**
    * Partially updates an existing event by ID.
    */
   patchEvent(id: string, patch: EventPatchRequest): Observable<Event> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.patch<Event>(`${this.baseUrl}/${id}`, patch).pipe(
         tap((updated) => {
            this.updateLocalEvent(id, updated);
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   /**
    * Deletes an event by ID and removes it from state signals.
    */
   deleteEvent(id: string): Observable<void> {
      this.loading.set(true);
      this.error.set(null);

      return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
         tap(() => {
            this.events.update((list) => list.filter((e) => e.id !== id));
            this.totalElements.update((count) => Math.max(0, count - 1));
            if (this.selectedEvent()?.id === id) {
               this.selectedEvent.set(null);
            }
            this.loading.set(false);
         }),
         catchError((err: ErrorResponse) => this.handleError(err))
      );
   }

   private updateLocalEvent(id: string, updated: Event): void {
      this.events.update((list) => list.map((e) => (e.id === id ? updated : e)));
      if (this.selectedEvent()?.id === id) {
         this.selectedEvent.set(updated);
      }
   }

   private handleError(errorRes: ErrorResponse): Observable<never> {
      const message =
         errorRes.message ?? 'An unexpected error occurred while processing the event.';
      this.error.set(message);
      this.loading.set(false);
      return throwError(() => new Error(message));
   }
}
