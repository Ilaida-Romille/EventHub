import { paginateItems } from "./pagination.js";

export function getStatusBadgeClass(status) {
   const value = String(status).trim().toLowerCase();

   if (value === "active") {
      return "badge-active";
   }

   if (value === "suspended") {
      return "badge-suspended";
   }

   if (value === "pending") {
      return "badge-pending text-warning";
   }

   return "badge-pending";
}

export function buildOrganizersWithEventCounts(organizersRows, upcomingEventsData) {
   const eventCountByOrganizerId = new Map();
   const upcomingEvents = Array.isArray(upcomingEventsData?.events)
      ? upcomingEventsData.events
      : [];

   upcomingEvents.forEach((event) => {
      if (!event.organizerId) {
         return;
      }

      const currentCount = eventCountByOrganizerId.get(event.organizerId) ?? 0;
      eventCountByOrganizerId.set(event.organizerId, currentCount + 1);
   });

   return (Array.isArray(organizersRows) ? organizersRows : []).map((organizer) => ({
      ...organizer,
      eventsCount: Number(eventCountByOrganizerId.get(organizer.organizerId) ?? 0)
   }));
}

export function filterOrganizers(organizers, companyQuery, statusQuery) {
   const normalizedCompanyQuery = String(companyQuery ?? "")
      .trim()
      .toLowerCase();
   const normalizedStatus = String(statusQuery ?? "")
      .trim()
      .toLowerCase();

   return organizers.filter((organizer) => {
      const matchesCompany =
         !normalizedCompanyQuery ||
         String(organizer.companyName ?? "")
            .toLowerCase()
            .includes(normalizedCompanyQuery);

      const matchesStatus =
         !normalizedStatus ||
         String(organizer.status ?? "")
            .trim()
            .toLowerCase() === normalizedStatus;

      return matchesCompany && matchesStatus;
   });
}

export function validateCompanySearchQuery(query, minLength = 3) {
   const normalizedQuery = String(query ?? "").trim();

   if (!normalizedQuery) {
      return {
         isValid: true,
         normalizedQuery: ""
      };
   }

   if (normalizedQuery.length < minLength) {
      return {
         isValid: false,
         normalizedQuery,
         message: `Enter at least ${minLength} characters to search by company name.`
      };
   }

   return {
      isValid: true,
      normalizedQuery
   };
}

export { paginateItems };
