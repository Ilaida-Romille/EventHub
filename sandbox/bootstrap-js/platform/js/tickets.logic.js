import { paginateItems } from "./pagination.js";

export function getRelativeOpenedText(createdAt, now = new Date()) {
   const createdDate = new Date(createdAt);

   if (Number.isNaN(createdDate.getTime())) {
      return "unknown";
   }

   const diffMs = Math.max(0, now.getTime() - createdDate.getTime());
   const dayMs = 24 * 60 * 60 * 1000;
   const dayDiff = Math.floor(diffMs / dayMs);

   if (dayDiff < 1) {
      return "today";
   }

   if (dayDiff === 1) {
      return "1 day ago";
   }

   if (dayDiff < 7) {
      return `${dayDiff} days ago`;
   }

   const weekDiff = Math.floor(dayDiff / 7);
   return weekDiff === 1 ? "1 week ago" : `${weekDiff} weeks ago`;
}

export function getStatusClass(status) {
   const normalizedStatus = String(status).trim().toLowerCase();

   if (normalizedStatus === "open") {
      return "badge-open";
   }

   if (normalizedStatus === "in progress") {
      return "badge-progress";
   }

   if (normalizedStatus === "resolved") {
      return "badge-resolved";
   }

   return "";
}

export function resolveActiveTicketId(pageTickets, selectedTicketId) {
   return pageTickets.some((ticket) => ticket.id === selectedTicketId)
      ? selectedTicketId
      : pageTickets[0]?.id;
}

export function paginateTickets(tickets, page, itemsPerPage) {
   return paginateItems(tickets, page, itemsPerPage);
}
