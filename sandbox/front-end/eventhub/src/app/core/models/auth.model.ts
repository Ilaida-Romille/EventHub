export type AppUserRole = 'platform_admin' | 'organizer_admin' | 'employee';

export interface MockUser {
   id: string;
   email: string;
   password: string;
   displayName: string;
   role: AppUserRole;
   organizationId: string | null;
   isActive: boolean;
}

export interface AuthSession {
   userId: string;
   email: string;
   displayName: string;
   role: AppUserRole;
   organizationId: string | null;
}

export interface LoginCredentials {
   email: string;
   password: string;
   remember: boolean;
}
