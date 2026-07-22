import { calculateInvoiceTotal } from "./billing.helpers.js";
import { paginateItems } from "./pagination.js";

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

function toSafeDate(dateValue) {
   if (!dateValue) {
      return null;
   }

   const date = new Date(dateValue);
   return Number.isNaN(date.getTime()) ? null : date;
}

function toBoundaryDate(dateValue, boundary) {
   const date = toSafeDate(dateValue);

   if (!date) {
      return null;
   }

   const rawValue = String(dateValue);
   const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(rawValue);
   const isMonthOnly = /^\d{4}-\d{2}$/.test(rawValue);

   if (isMonthOnly) {
      const [yearValue, monthValue] = rawValue.split("-");
      const year = Number(yearValue);
      const monthIndex = Number(monthValue) - 1;

      if (boundary === "end") {
         return new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));
      }

      return new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
   }

   if (!isDateOnly) {
      return date;
   }

   const next = new Date(date.getTime());

   if (boundary === "end") {
      next.setUTCHours(23, 59, 59, 999);
   } else {
      next.setUTCHours(0, 0, 0, 0);
   }

   return next;
}

export function filterInvoices(invoices, filters = {}) {
   const normalizedQuery = String(filters.query ?? "")
      .trim()
      .toLowerCase();
   const fromDate = toBoundaryDate(filters.fromDate, "start");
   const toDate = toBoundaryDate(filters.toDate, "end");

   return (Array.isArray(invoices) ? invoices : []).filter((invoice) => {
      const organizer = String(invoice.organizer ?? "").toLowerCase();
      const invoiceNumber = String(invoice.invoiceNumber ?? "").toLowerCase();
      const matchesQuery =
         !normalizedQuery ||
         organizer.includes(normalizedQuery) ||
         invoiceNumber.includes(normalizedQuery);

      const issuedAt = toSafeDate(invoice.issuedAt);
      const startsAfterFrom = !fromDate || (issuedAt && issuedAt >= fromDate);
      const endsBeforeTo = !toDate || (issuedAt && issuedAt <= toDate);

      return matchesQuery && startsAfterFrom && endsBeforeTo;
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
            invoiceNumbers: [],
            latestIssuedAt: null
         });
      }

      const option = optionsMap.get(invoice.organizerId);
      if (invoice.invoiceNumber) {
         option.invoiceNumbers.push(String(invoice.invoiceNumber));
      }

      const issuedAt = toSafeDate(invoice.issuedAt);
      const latestIssuedAt = toSafeDate(option.latestIssuedAt);
      if (issuedAt && (!latestIssuedAt || issuedAt > latestIssuedAt)) {
         option.primaryInvoiceNumber = String(invoice.invoiceNumber ?? "No invoice number");
         option.latestIssuedAt = issuedAt.toISOString();
      }
   });

   return Array.from(optionsMap.values())
      .map((option) => ({
         ...option,
         primaryInvoiceNumber:
            option.primaryInvoiceNumber ?? option.invoiceNumbers[0] ?? "No invoice number"
      }))
      .sort((a, b) => a.organizerName.localeCompare(b.organizerName));
}

export { paginateItems };
