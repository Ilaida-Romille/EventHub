export type EventStatus =
   'draft' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled';

export interface EventCapacity {
   maximum: number;
   registered: number;
}

export interface AgendaItem {
   id?: string;
   startDateTime: string;
   endDateTime: string;
   title: string;
   description?: string;
   location?: string;
   speaker?: string;
   isBreak: boolean;
}

export interface Event {
   id?: string;
   title: string;
   description: string;
   organizerId: string;
   organizerName: string;
   status: EventStatus;
   startDateTime: string;
   endDateTime: string;
   registrationOpensAt: string;
   registrationClosesAt: string;
   venue: string;
   bannerImageUrl: string;
   capacity: EventCapacity;
   agenda?: AgendaItem[];
}

export type EventPatchRequest = Partial<Omit<Event, 'id'>>;

export interface EventQueryParams {
   title?: string;
   status?: EventStatus;
   organizerId?: string;
   venue?: string;
   startDateFrom?: string;
   startDateTo?: string;
   page?: number;
   size?: number;
   sortBy?: 'id' | 'title' | 'status' | 'startDateTime' | 'endDateTime' | 'venue' | 'organizerName';
   sortDir?: 'asc' | 'desc';
   all?: boolean;
}
