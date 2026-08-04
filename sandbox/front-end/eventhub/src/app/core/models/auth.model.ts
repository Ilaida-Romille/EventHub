export type AppUserRole = 'platform_admin' | 'organizer_admin' | 'attendee';

export interface MockUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: AppUserRole;
    organizationId: string | null;
    avatarUrl?: string;
}

export interface AuthSession {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: AppUserRole;
    organizationId: string | null;
    avatarUrl?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    remember: boolean;
}
