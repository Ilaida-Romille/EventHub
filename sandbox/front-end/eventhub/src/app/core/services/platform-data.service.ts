import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { MockApiService } from './mock-api.service';
import { MockUser } from '../models/auth.models';
import {
   BillingTableRow,
   DashboardAnalytics,
   EventRecord,
   InvoiceRecord,
   OrganizerTableRow,
   OrganizationRecord,
   SupportTicketRecord,
   TicketTableRow
} from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class PlatformDataService {
   private readonly mockApi = inject(MockApiService);

   getOrganizations(): Observable<OrganizationRecord[]> {
      return this.mockApi.fetchResource<OrganizationRecord[]>('catalog/organizations.json');
   }

   getEvents(): Observable<EventRecord[]> {
      return this.mockApi.fetchResource<EventRecord[]>('catalog/events.json');
   }

   getInvoices(): Observable<InvoiceRecord[]> {
      return this.mockApi.fetchResource<InvoiceRecord[]>('finance/invoices.json');
   }

   getAnalytics(): Observable<DashboardAnalytics> {
      return this.mockApi.fetchResource<DashboardAnalytics>('analytics/dashboard.json');
   }

   getOrganizerTableRows(): Observable<OrganizerTableRow[]> {
      return forkJoin({
         organizations: this.getOrganizations(),
         events: this.getEvents(),
         users: this.mockApi.fetchResource<MockUser[]>('auth/users.json')
      }).pipe(
         map(({ organizations, events, users }) => {
            const eventCountByOrg = events.reduce<Record<string, number>>((acc, event) => {
               acc[event.organizationId] = (acc[event.organizationId] ?? 0) + 1;
               return acc;
            }, {});

            return organizations.map((organization) => {
               const owner = users.find((user) => user.id === organization.ownerUserId);

               return {
                  id: organization.id,
                  name: organization.name,
                  events: eventCountByOrg[organization.id] ?? 0,
                  status: organization.status,
                  accountLead: owner?.displayName ?? 'Unassigned',
                  createdAt: organization.createdAt
               };
            });
         })
      );
   }

   getBillingTableRows(): Observable<BillingTableRow[]> {
      return forkJoin({
         invoices: this.getInvoices(),
         organizations: this.getOrganizations()
      }).pipe(
         map(({ invoices, organizations }) => {
            const orgLookup = new Map(
               organizations.map((organization) => [organization.id, organization.name])
            );

            return invoices.map((invoice) => ({
               id: invoice.id,
               organizerId: invoice.organizationId,
               invoiceNumber: invoice.invoiceNumber,
               organizerName: orgLookup.get(invoice.organizationId) ?? 'Unknown Organization',
               period: invoice.billingPeriod,
               amountPhp: invoice.amountPhp,
               status: invoice.status,
               issuedAt: invoice.issuedAt
            }));
         })
      );
   }

   getSupportTickets(): Observable<SupportTicketRecord[]> {
      return this.mockApi.fetchResource<SupportTicketRecord[]>('support/tickets.json');
   }

   getTicketRows(): Observable<TicketTableRow[]> {
      return forkJoin({
         tickets: this.getSupportTickets(),
         organizations: this.getOrganizations(),
         users: this.mockApi.fetchResource<MockUser[]>('auth/users.json')
      }).pipe(
         map(({ tickets, organizations, users }) => {
            const organizationLookup = new Map(
               organizations.map((organization) => [organization.id, organization.name])
            );
            const userLookup = new Map(users.map((user) => [user.id, user.displayName]));

            return tickets.map((ticket) => ({
               ...ticket,
               companyName: organizationLookup.get(ticket.organizationId) ?? 'Unknown Organization',
               openedAgo: ticket.createdAt,
               assignedTo: userLookup.get(ticket.assignedUserId) ?? 'Unassigned'
            }));
         })
      );
   }
}
