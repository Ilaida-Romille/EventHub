export type OrganizationStatus = 'active' | 'pending' | 'suspended';
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface OrganizationRecord {
   id: string;
   name: string;
   status: OrganizationStatus;
   ownerUserId: string;
   createdAt: string;
}

export interface EventRecord {
   id: string;
   organizationId: string;
   category: 'tech' | 'social' | 'corporate';
   title: string;
   startAt: string;
   endAt: string;
   venue: string;
   capacityTotal: number;
   capacityUsed: number;
}

export interface InvoiceRecord {
   id: string;
   organizationId: string;
   invoiceNumber: string;
   billingPeriod: string;
   amountPhp: number;
   status: InvoiceStatus;
   issuedAt: string;
   dueAt: string;
}

export interface DashboardAnalytics {
   monthlyEventVolume: { month: string; count: number }[];
}

export interface OrganizerTableRow {
   [key: string]: string | number | undefined;
   id: string;
   name: string;
   events: number;
   status: OrganizationStatus;
   accountLead: string;
   createdAt: string;
}

export interface BillingTableRow {
   [key: string]: string | number | undefined;
   id: string;
   organizerId: string;
   invoiceNumber: string;
   organizerName: string;
   period: string;
   amountPhp: number;
   status: InvoiceStatus;
   issuedAt: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketPriority = 'high' | 'medium' | 'low';

export interface SupportTicketRecord {
   id: string;
   organizationId: string;
   subject: string;
   status: TicketStatus;
   priority: TicketPriority;
   assignedUserId: string;
   createdAt: string;
}

export interface TicketTableRow extends SupportTicketRecord {
   companyName: string;
   openedAgo: string;
   assignedTo: string;
}
