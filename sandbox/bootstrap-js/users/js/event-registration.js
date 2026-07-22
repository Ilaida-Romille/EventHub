import { getUsersUpcomingEventsData } from "../../js/api/data-api.js";

function formatDateLabel(dateValue) {
   const date = new Date(dateValue);

   if (Number.isNaN(date.getTime())) {
      return "Date TBD";
   }

   return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
   }).format(date);
}

function buildTimeRange(event) {
   const start = event.timeStart ?? "TBD";
   const end = event.timeEnd ?? "TBD";
   return `${start} - ${end}`;
}

function applyEventToRegistration(event) {
   const titleEl = document.getElementById("registration-event-title");
   const dateEl = document.getElementById("registration-event-date");
   const timeEl = document.getElementById("registration-event-time");
   const venueEl = document.getElementById("registration-event-venue");
   const eventIdInput = document.getElementById("registration-event-id");

   if (titleEl) {
      titleEl.textContent = event?.title ?? "Event Not Found";
   }

   if (dateEl) {
      dateEl.textContent = event ? formatDateLabel(event.date) : "Date TBD";
   }

   if (timeEl) {
      timeEl.textContent = event ? buildTimeRange(event) : "Time TBD";
   }

   if (venueEl) {
      venueEl.textContent = event?.venue ?? "Venue TBD";
   }

   if (eventIdInput) {
      eventIdInput.value = event?.id ?? "";
   }
}

async function loadRegistrationEvent() {
   const eventIdInput = document.getElementById("registration-event-id");

   if (eventIdInput) {
      eventIdInput.setAttribute("aria-busy", "true");
   }

   try {
      const params = new URLSearchParams(window.location.search);
      const eventId = params.get("eventId");

      const data = await getUsersUpcomingEventsData();
      const events = Array.isArray(data.events) ? data.events : [];

      const selectedEvent = events.find((event) => event.id === eventId) ?? null;

      applyEventToRegistration(selectedEvent);
   } catch (error) {
      console.error("Failed to load registration event.", error);
      applyEventToRegistration(null);
   } finally {
      if (eventIdInput) {
         eventIdInput.setAttribute("aria-busy", "false");
      }
   }
}

document.addEventListener("DOMContentLoaded", loadRegistrationEvent);
