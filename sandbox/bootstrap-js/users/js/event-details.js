function buildAgendaItem(entry) {
   const item = document.createElement("div");
   item.className = `timeline-card${entry.active ? " active-session" : ""}`;

   item.innerHTML = `
      <div class="time-block">${entry.time}</div>
      <div class="details-block">
         <h3>${entry.title}</h3>
         <p class="session-location">
            <span class="material-symbols-outlined">${entry.icon}</span> ${entry.location}
         </p>
      </div>
   `;

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

   row.innerHTML = `
      <div class="avatar" aria-hidden="true">${attendee.initials}</div>
      <div class="attendee-info">
         <span class="name">${attendee.name}</span>
         <span class="comp">${attendee.company}</span>
      </div>
   `;

   return row;
}

function renderEventDetails(data) {
   const agendaList = document.getElementById("event-agenda-list");
   const attendeeList = document.getElementById("event-attendee-list");
   const attendeeCountIndicator = document.querySelector(".more-row .indicator");

   if (agendaList) {
      agendaList.innerHTML = "";
      (data.agenda ?? []).forEach((entry) => agendaList.appendChild(buildAgendaItem(entry)));
   }

   if (attendeeList) {
      attendeeList.innerHTML = "";
      const attendees = Array.isArray(data.attendees) ? data.attendees : [];
      attendees
         .slice(0, 3)
         .forEach((attendee) => attendeeList.appendChild(buildAttendeeRow(attendee)));

      const moreRow = document.createElement("div");
      moreRow.className = "more-row";
      moreRow.innerHTML = `<span class="indicator">+ ${Math.max(0, attendees.length - 3)} more attendees</span>`;
      attendeeList.appendChild(moreRow);
   }

   if (attendeeCountIndicator && data.event?.moreAttendeesCount !== undefined) {
      attendeeCountIndicator.textContent = `+ ${data.event.moreAttendeesCount} more attendees`;
   }
}

async function loadEventDetails() {
   try {
      const params = new URLSearchParams(window.location.search);
      const eventIdFromUrl = params.get("eventId");

      const [detailsResponse, eventsResponse] = await Promise.all([
         fetch("./data/event-details-data.json"),
         fetch("./data/upcoming-events-data.json")
      ]);

      const [detailsData, eventsData] = await Promise.all([
         detailsResponse.json(),
         eventsResponse.json()
      ]);

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
   }
}

document.addEventListener("DOMContentLoaded", loadEventDetails);
