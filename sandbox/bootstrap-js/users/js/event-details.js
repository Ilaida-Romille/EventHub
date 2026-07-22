import { getUsersEventDetailsPayload } from "../../js/api/data-api.js";

function buildAgendaItem(entry) {
   const item = document.createElement("div");
   item.className = `timeline-card${entry.active ? " active-session" : ""}`;

   const timeBlock = document.createElement("div");
   timeBlock.className = "time-block";
   timeBlock.textContent = entry.time;

   const detailsBlock = document.createElement("div");
   detailsBlock.className = "details-block";

   const heading = document.createElement("h3");
   heading.textContent = entry.title;

   const sessionLocation = document.createElement("p");
   sessionLocation.className = "session-location";

   const locationIcon = document.createElement("span");
   locationIcon.className = "material-symbols-outlined";
   locationIcon.textContent = entry.icon;

   sessionLocation.appendChild(locationIcon);
   sessionLocation.appendChild(document.createTextNode(` ${entry.location}`));

   detailsBlock.appendChild(heading);
   detailsBlock.appendChild(sessionLocation);

   item.appendChild(timeBlock);
   item.appendChild(detailsBlock);

   return item;
}

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

function buildAttendeeRow(attendee) {
   const row = document.createElement("div");
   row.className = "attendee-row";

   const avatar = document.createElement("div");
   avatar.className = "avatar";
   avatar.setAttribute("aria-hidden", "true");
   avatar.textContent = attendee.initials;

   const attendeeInfo = document.createElement("div");
   attendeeInfo.className = "attendee-info";

   const attendeeName = document.createElement("span");
   attendeeName.className = "name";
   attendeeName.textContent = attendee.name;

   const attendeeCompany = document.createElement("span");
   attendeeCompany.className = "comp";
   attendeeCompany.textContent = attendee.company;

   attendeeInfo.appendChild(attendeeName);
   attendeeInfo.appendChild(attendeeCompany);

   row.appendChild(avatar);
   row.appendChild(attendeeInfo);

   return row;
}

function renderEventDetails(data) {
   const agendaList = document.getElementById("event-agenda-list");
   const attendeeList = document.getElementById("event-attendee-list");
   const attendeeCountIndicator = document.querySelector(".more-row .indicator");

   if (agendaList) {
      agendaList.replaceChildren();
      (data.agenda ?? []).forEach((entry) => agendaList.appendChild(buildAgendaItem(entry)));
   }

   if (attendeeList) {
      attendeeList.replaceChildren();
      const attendees = Array.isArray(data.attendees) ? data.attendees : [];
      attendees
         .slice(0, 3)
         .forEach((attendee) => attendeeList.appendChild(buildAttendeeRow(attendee)));

      const moreRow = document.createElement("div");
      moreRow.className = "more-row";
      const indicator = document.createElement("span");
      indicator.className = "indicator";
      indicator.textContent = `+ ${Math.max(0, attendees.length - 3)} more attendees`;
      moreRow.appendChild(indicator);
      attendeeList.appendChild(moreRow);
   }

   if (attendeeCountIndicator && data.event?.moreAttendeesCount !== undefined) {
      attendeeCountIndicator.textContent = `+ ${data.event.moreAttendeesCount} more attendees`;
   }
}

function setEventDetailsLoading(isLoading) {
   const agendaList = document.getElementById("event-agenda-list");
   const attendeeList = document.getElementById("event-attendee-list");

   if (agendaList) {
      agendaList.setAttribute("aria-busy", String(isLoading));
   }

   if (attendeeList) {
      attendeeList.setAttribute("aria-busy", String(isLoading));
   }
}

async function loadEventDetails() {
   setEventDetailsLoading(true);

   try {
      const params = new URLSearchParams(window.location.search);
      const eventIdFromUrl = params.get("eventId");

      const [detailsData, eventsData] = await getUsersEventDetailsPayload();

      const events = Array.isArray(eventsData.events) ? eventsData.events : [];
      const resolvedEventId = eventIdFromUrl || detailsData.eventId;
      const baseEvent = events.find((event) => event.id === resolvedEventId) ?? null;

      const attendees = (Array.isArray(detailsData.attendees) ? detailsData.attendees : []).map(
         (attendee) => ({
            ...attendee,
            company: attendee.company ?? "Independent Attendee"
         })
      );

      const mergedData = {
         ...detailsData,
         event: {
            title: baseEvent?.title ?? "Event Details",
            dateLabel: formatDateLabel(baseEvent?.date),
            location: "Grand Stage",
            venue: "Quezon City, Metro Manila",
            description:
               "A premium technology forum featuring keynote talks, breakout sessions, and networking for enterprise teams.",
            moreAttendeesCount: Math.max(0, attendees.length - 3)
         },
         attendees
      };

      renderEventDetails(mergedData);
   } catch (error) {
      console.error("Failed to load event details data.", error);
   } finally {
      setEventDetailsLoading(false);
   }
}

document.addEventListener("DOMContentLoaded", loadEventDetails);
