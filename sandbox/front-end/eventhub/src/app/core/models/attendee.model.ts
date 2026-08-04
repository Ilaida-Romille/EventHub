export interface Attendee {
   id?: string;
   firstName: string;
   lastName: string;
   email: string;
   company: string;
   department: string;
   jobTitle: string;
   avatarUrl?: string;
   registeredEventIds: string[];
}

export type AttendeePatchRequest = Partial<Omit<Attendee, 'id'>>;

export interface AttendeeQueryParams {
   firstName?: string;
   lastName?: string;
   email?: string;
   company?: string;
   department?: string;
   jobTitle?: string;
   page?: number; // Default: 0
   size?: number; // Default: 10
   sortBy?: 'id' | 'firstName' | 'lastName' | 'email' | 'company' | 'department' | 'jobTitle';
   sortDir?: 'asc' | 'desc';
   all?: boolean;
}
