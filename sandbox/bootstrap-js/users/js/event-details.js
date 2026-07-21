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
      const response = await fetch("./data/event-details-data.json");
      const data = await response.json();
      renderEventDetails(data);
   } catch (error) {
      console.error("Failed to load event details data.", error);
   }
}

document.addEventListener("DOMContentLoaded", loadEventDetails);
