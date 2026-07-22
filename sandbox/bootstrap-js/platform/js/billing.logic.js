import { calculateInvoiceTotal } from "./utils.js";

export function formatInvoicePeriod(issuedAt) {
   const date = new Date(issuedAt);

   if (Number.isNaN(date.getTime())) {
      return "N/A";
   }

   return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC"
   }).format(date);
}

export function getBillingStatusBadgeClass(status) {
   const value = String(status).trim().toLowerCase();

   if (value === "paid") {
      return "badge-paid";
   }

   return "badge-overdue";
}

export function buildBillingViewModel(
   billingRows,
   organizersData,
   upcomingEventsData,
   baseRatePerAttendee
) {
   const organizersMap = new Map(
      (Array.isArray(organizersData) ? organizersData : []).map((organizer) => [
         organizer.organizerId,
         organizer
      ])
   );

   const attendeeCountByOrganizerId = new Map();
   const upcomingEvents = Array.isArray(upcomingEventsData?.events)
      ? upcomingEventsData.events
      : [];

   upcomingEvents.forEach((event) => {
      if (!event.organizerId) {
         return;
      }

      const currentCount = attendeeCountByOrganizerId.get(event.organizerId) ?? 0;
      attendeeCountByOrganizerId.set(
         event.organizerId,
         currentCount + Number(event.capacityUsed ?? 0)
      );
   });

   const invoices = (Array.isArray(billingRows) ? billingRows : []).map((invoice) => {
      const attendeeCount = Number(attendeeCountByOrganizerId.get(invoice.organizerId) ?? 0);

      return {
         ...invoice,
         organizer: organizersMap.get(invoice.organizerId)?.companyName ?? "Unknown Organizer",
         attendeeCount,
         amount: calculateInvoiceTotal(attendeeCount, baseRatePerAttendee),
         period: formatInvoicePeriod(invoice.issuedAt)
      };
   });

   return {
      invoices,
      attendeeCountByOrganizerId
   };
}

export function filterInvoicesByQuery(invoices, query, minLength = 3) {
   const normalizedQuery = String(query ?? "")
      .trim()
      .toLowerCase();

   if (!normalizedQuery) {
      return invoices;
   }

   if (normalizedQuery.length < minLength) {
      return [];
   }

   return invoices.filter((invoice) => {
      const organizer = String(invoice.organizer ?? "").toLowerCase();
      const invoiceNumber = String(invoice.invoiceNumber ?? "").toLowerCase();
      return organizer.includes(normalizedQuery) || invoiceNumber.includes(normalizedQuery);
   });
}

export function buildOrganizerInvoiceOptions(invoices) {
   const optionsMap = new Map();

   invoices.forEach((invoice) => {
      if (!invoice.organizerId) {
         return;
      }

      if (!optionsMap.has(invoice.organizerId)) {
         optionsMap.set(invoice.organizerId, {
            organizerId: invoice.organizerId,
            organizerName: invoice.organizer ?? "Unknown Organizer",
            invoiceNumbers: []
         });
      }

      const option = optionsMap.get(invoice.organizerId);
      if (invoice.invoiceNumber) {
         option.invoiceNumbers.push(String(invoice.invoiceNumber));
      }
   });

   return Array.from(optionsMap.values())
      .map((option) => ({
         ...option,
         label: `${option.organizerName} (${option.invoiceNumbers.join(", ") || "No invoice number"})`
      }))
      .sort((a, b) => a.organizerName.localeCompare(b.organizerName));
}

export function paginateItems(items, page, itemsPerPage) {
   const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
   const currentPage = Math.min(Math.max(1, page), totalPages);
   const start = (currentPage - 1) * itemsPerPage;

   return {
      currentPage,
      totalPages,
      pageItems: items.slice(start, start + itemsPerPage)
   };
}
