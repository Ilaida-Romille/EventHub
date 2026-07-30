export interface Employee {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   company: string;
   department: string;
   jobTitle: string;
   avatarUrl?: string;
   registeredEventIds: string[];
}

export interface EmployeeInput {
   firstName: string;
   lastName: string;
   email: string;
   company: string;
   department: string;
   jobTitle: string;
   avatarUrl?: string;
   registeredEventIds: string[];
}

export interface EmployeePatch {
   firstName?: string;
   lastName?: string;
   email?: string;
   company?: string;
   department?: string;
   jobTitle?: string;
   avatarUrl?: string;
   registeredEventIds?: string[];
}

export interface ErrorResponse {
   message?: string;
}
