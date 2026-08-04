import { inject, signal, computed, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { Attendee, AttendeePatchRequest, AttendeeQueryParams } from '../models/attendee.model';
import { PagedResponse, ErrorResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class AttendeeService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/Attendees';

    readonly Attendees = signal<Attendee[]>([]);
    readonly selectedAttendee = signal<Attendee | null>(null);
    readonly totalElements = signal<number>(0);
    readonly totalPages = signal<number>(0);
    readonly currentPage = signal<number>(0);
    readonly loading = signal<boolean>(false);
    readonly error = signal<string | null>(null);

    readonly hasAttendees = computed(() => this.Attendees().length > 0);
    readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);

    getAttendees(params?: AttendeeQueryParams): Observable<PagedResponse<Attendee>> {
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

        return this.http.get<PagedResponse<Attendee>>(this.baseUrl, { params: httpParams }).pipe(
            tap((response) => {
                this.Attendees.set(response.content ?? []);
                this.totalElements.set(response.totalElements ?? 0);
                this.totalPages.set(response.totalPages ?? 0);
                this.currentPage.set(response.page ?? 0);
                this.loading.set(false);
            }),
            catchError((err: ErrorResponse) => this.handleError(err))
        );
    }

    getAttendeeById(id: string): Observable<Attendee> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.get<Attendee>(`${this.baseUrl}/${id}`).pipe(
            tap((Attendee) => {
                this.selectedAttendee.set(Attendee);
                this.loading.set(false);
            }),
            catchError((err: ErrorResponse) => this.handleError(err))
        );
    }

    getAttendeeByEmail(email: string): Observable<Attendee> {
        return this.getAttendees({ email, page: 0, size: 1 }).pipe(
            map((response) => {
                const Attendee = response.content?.[0] ?? null;
                if (!Attendee) {
                    throw new Error('Attendee not found');
                }
                return Attendee;
            })
        );
    }

    createAttendee(Attendee: Attendee): Observable<Attendee> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.post<Attendee>(this.baseUrl, Attendee).pipe(
            tap((newAttendee) => {
                this.Attendees.update((list) => [newAttendee, ...list]);
                this.totalElements.update((count) => count + 1);
                this.loading.set(false);
            }),
            catchError((err: ErrorResponse) => this.handleError(err))
        );
    }

    updateAttendee(id: string, Attendee: Attendee): Observable<Attendee> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.put<Attendee>(`${this.baseUrl}/${id}`, Attendee).pipe(
            tap((updated) => {
                this.updateLocalAttendee(id, updated);
                this.loading.set(false);
            }),
            catchError((err: ErrorResponse) => this.handleError(err))
        );
    }

    patchAttendee(id: string, patch: AttendeePatchRequest): Observable<Attendee> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.patch<Attendee>(`${this.baseUrl}/${id}`, patch).pipe(
            tap((updated) => {
                this.updateLocalAttendee(id, updated);
                this.loading.set(false);
            }),
            catchError((err: ErrorResponse) => this.handleError(err))
        );
    }

    deleteAttendee(id: string): Observable<void> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            tap(() => {
                this.Attendees.update((list) => list.filter((e) => e.id !== id));
                this.totalElements.update((count) => Math.max(0, count - 1));
                if (this.selectedAttendee()?.id === id) {
                    this.selectedAttendee.set(null);
                }
                this.loading.set(false);
            }),
            catchError((err: ErrorResponse) => this.handleError(err))
        );
    }

    private updateLocalAttendee(id: string, updated: Attendee): void {
        this.Attendees.update((list) => list.map((e) => (e.id === id ? updated : e)));
        if (this.selectedAttendee()?.id === id) {
            this.selectedAttendee.set(updated);
        }
    }

    private handleError(errorRes: ErrorResponse): Observable<never> {
        const message =
            errorRes.message ?? 'An unexpected error occurred while processing the Attendee.';
        this.error.set(message);
        this.loading.set(false);
        return throwError(() => new Error(message));
    }
}
