export type EventStatus =
   'draft' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled';

export interface EventCapacity {
   maximum: number;
   registered: number;
}

export interface AgendaItem {
   id: string;
   startDateTime: string;
   endDateTime: string;
   title: string;
   description?: string;
   location?: string;
   speaker?: string;
   isBreak: boolean;
}

export interface Event {
   id: string;
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
   agenda: AgendaItem[];
}

export interface EventInput {
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
   agenda: AgendaItem[];
}

export interface EventPatch {
   title?: string;
   description?: string;
   organizerId?: string;
   organizerName?: string;
   status?: EventStatus;
   startDateTime?: string;
   endDateTime?: string;
   registrationOpensAt?: string;
   registrationClosesAt?: string;
   venue?: string;
   bannerImageUrl?: string;
   capacity?: EventCapacity;
   agenda?: AgendaItem[];
}

export interface ErrorResponse {
   message?: string;
}
