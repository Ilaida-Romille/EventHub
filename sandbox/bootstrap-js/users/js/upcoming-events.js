const UPCOMING_EVENTS_PER_PAGE = 6;
let upcomingEvents = [];
let currentPage = 1;

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

function formatCapacityText(event) {
   if (event.capacityText) {
      return event.capacityText;
   }

   return `${Number(event.capacityUsed ?? 0)}/${Number(event.capacityTotal ?? 0)}`;
}

function buildEventCard(event) {
   const col = document.createElement("div");
   col.className = "col";

   col.innerHTML = `
      <article class="event-card">
         <div class="card-inner">
            <div class="card-front">
               <div class="event-thumbnail">
                  <span class="room-capacity-pill">
                     <span class="material-symbols-outlined">groups</span>
                     ${formatCapacityText(event)}
                  </span>
               </div>
               <div class="event-details">
                  <div class="event-date">
                     <span class="material-symbols-outlined detail-icon calendar-icon">calendar_today</span>
                     ${event.dateLabel}
                  </div>
                  <h2>${event.title}</h2>
                  <div class="event-organizer">
                     <span class="material-symbols-outlined detail-icon">corporate_fare</span>
                     by ${event.organizer}
                  </div>
                  <div class="event-categories">
                     <span class="category-pill">
                        <span class="material-symbols-outlined category-icon">${event.categoryIcon}</span>
                        ${event.category}
                     </span>
                  </div>
               </div>
            </div>
            <div class="card-back">
               <div>
                  <h2>${event.title}</h2>
                  <p class="event-description">${event.description}</p>
               </div>
               <a href="${event.actionHref}" class="btn btn-primary w-100 fw-bold">${event.actionLabel}</a>
            </div>
         </div>
      </article>
   `;

   return col;
}

function renderPagination(totalPages) {
   const pagination = document.getElementById("upcoming-events-pagination");

   if (!pagination) {
      return;
   }

   pagination.innerHTML = "";

   const createPageItem = (label, page, disabled = false, active = false) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `?page=${page}`;
      a.textContent = label;

      if (disabled) {
         a.setAttribute("aria-disabled", "true");
         a.tabIndex = -1;
      }

      if (active) {
         a.classList.add("active");
      }

      li.appendChild(a);
      return li;
   };

   pagination.appendChild(createPageItem("«", Math.max(1, currentPage - 1), currentPage === 1));

   for (let page = 1; page <= totalPages; page += 1) {
      pagination.appendChild(createPageItem(String(page), page, false, page === currentPage));
   }

   pagination.appendChild(
      createPageItem("»", Math.min(totalPages, currentPage + 1), currentPage === totalPages)
   );
}

function renderEventsPage() {
   const grid = document.getElementById("upcoming-events-grid");

   if (!grid) {
      return;
   }

   grid.innerHTML = "";

   const totalPages = Math.max(1, Math.ceil(upcomingEvents.length / UPCOMING_EVENTS_PER_PAGE));
   const safePage = Math.min(Math.max(1, currentPage), totalPages);
   currentPage = safePage;

   const start = (currentPage - 1) * UPCOMING_EVENTS_PER_PAGE;
   const pageEvents = upcomingEvents.slice(start, start + UPCOMING_EVENTS_PER_PAGE);

   pageEvents.forEach((event) => grid.appendChild(buildEventCard(event)));
   renderPagination(totalPages);
}

async function loadUpcomingEvents() {
   try {
      const [eventsResponse, organizersResponse] = await Promise.all([
         fetch("./data/upcoming-events-data.json"),
         fetch("../platform/data/organizers-data.json")
      ]);

      const [eventsData, organizersData] = await Promise.all([
         eventsResponse.json(),
         organizersResponse.json()
      ]);

      const organizersMap = new Map(
         (Array.isArray(organizersData) ? organizersData : []).map((organizer) => [
            organizer.organizerId,
            organizer
         ])
      );
      const categoriesMap = new Map(
         (Array.isArray(eventsData.categories) ? eventsData.categories : []).map((category) => [
            category.id,
            category
         ])
      );

      const events = Array.isArray(eventsData.events) ? eventsData.events : [];
      upcomingEvents = events.map((event) => {
         const organizer = organizersMap.get(event.organizerId);
         const category = categoriesMap.get(event.categoryId);

         return {
            ...event,
            organizer: organizer?.companyName ?? "Unknown Organizer",
            category: category?.name ?? "General",
            categoryIcon: category?.icon ?? "event",
            dateLabel: formatDateLabel(event.date),
            capacityText: `${Number(event.capacityUsed ?? 0)}/${Number(event.capacityTotal ?? 0)}`
         };
      });

      renderEventsPage();
   } catch (error) {
      console.error("Failed to load upcoming events.", error);
   }
}

document.addEventListener("DOMContentLoaded", () => {
   const params = new URLSearchParams(window.location.search);
   currentPage = Number.parseInt(params.get("page") ?? "1", 10) || 1;
   loadUpcomingEvents();
});
