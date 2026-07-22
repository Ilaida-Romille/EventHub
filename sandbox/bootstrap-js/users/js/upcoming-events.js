import { getUsersUpcomingEventsPayload } from "../../js/api/data-api.js";

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

   const article = document.createElement("article");
   article.className = "event-card";

   const cardInner = document.createElement("div");
   cardInner.className = "card-inner";

   const cardFront = document.createElement("div");
   cardFront.className = "card-front";

   const thumbnail = document.createElement("div");
   thumbnail.className = "event-thumbnail";

   const capacityPill = document.createElement("span");
   capacityPill.className = "room-capacity-pill";
   const groupsIcon = document.createElement("span");
   groupsIcon.className = "material-symbols-outlined";
   groupsIcon.textContent = "groups";
   capacityPill.appendChild(groupsIcon);
   capacityPill.appendChild(document.createTextNode(` ${formatCapacityText(event)}`));

   thumbnail.appendChild(capacityPill);

   const details = document.createElement("div");
   details.className = "event-details";

   const dateInfo = document.createElement("div");
   dateInfo.className = "event-date";
   const calendarIcon = document.createElement("span");
   calendarIcon.className = "material-symbols-outlined detail-icon calendar-icon";
   calendarIcon.textContent = "calendar_today";
   dateInfo.appendChild(calendarIcon);
   dateInfo.appendChild(document.createTextNode(` ${event.dateLabel}`));

   const title = document.createElement("h2");
   title.textContent = event.title;

   const organizer = document.createElement("div");
   organizer.className = "event-organizer";
   const organizerIcon = document.createElement("span");
   organizerIcon.className = "material-symbols-outlined detail-icon";
   organizerIcon.textContent = "corporate_fare";
   organizer.appendChild(organizerIcon);
   organizer.appendChild(document.createTextNode(` by ${event.organizer}`));

   const categories = document.createElement("div");
   categories.className = "event-categories";
   const categoryPill = document.createElement("span");
   categoryPill.className = "category-pill";
   const categoryIcon = document.createElement("span");
   categoryIcon.className = "material-symbols-outlined category-icon";
   categoryIcon.textContent = event.categoryIcon;
   categoryPill.appendChild(categoryIcon);
   categoryPill.appendChild(document.createTextNode(` ${event.category}`));
   categories.appendChild(categoryPill);

   details.appendChild(dateInfo);
   details.appendChild(title);
   details.appendChild(organizer);
   details.appendChild(categories);

   cardFront.appendChild(thumbnail);
   cardFront.appendChild(details);

   const cardBack = document.createElement("div");
   cardBack.className = "card-back";

   const backTop = document.createElement("div");
   const backTitle = document.createElement("h2");
   backTitle.textContent = event.title;
   const description = document.createElement("p");
   description.className = "event-description";
   description.textContent = event.description;
   backTop.appendChild(backTitle);
   backTop.appendChild(description);

   const actionLink = document.createElement("a");
   actionLink.href = event.actionHref;
   actionLink.className = "btn btn-primary w-100 fw-bold";
   actionLink.textContent = event.actionLabel;

   cardBack.appendChild(backTop);
   cardBack.appendChild(actionLink);

   cardInner.appendChild(cardFront);
   cardInner.appendChild(cardBack);
   article.appendChild(cardInner);
   col.appendChild(article);

   return col;
}

function renderPagination(totalPages) {
   const pagination = document.getElementById("upcoming-events-pagination");

   if (!pagination) {
      return;
   }

   pagination.replaceChildren();

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

   grid.replaceChildren();

   const totalPages = Math.max(1, Math.ceil(upcomingEvents.length / UPCOMING_EVENTS_PER_PAGE));
   const safePage = Math.min(Math.max(1, currentPage), totalPages);
   currentPage = safePage;

   const start = (currentPage - 1) * UPCOMING_EVENTS_PER_PAGE;
   const pageEvents = upcomingEvents.slice(start, start + UPCOMING_EVENTS_PER_PAGE);

   pageEvents.forEach((event) => grid.appendChild(buildEventCard(event)));
   renderPagination(totalPages);
}

function setEventsLoading(isLoading) {
   const grid = document.getElementById("upcoming-events-grid");

   if (grid) {
      grid.setAttribute("aria-busy", String(isLoading));
   }
}

async function loadUpcomingEvents() {
   setEventsLoading(true);

   try {
      const [eventsData, organizersData] = await getUsersUpcomingEventsPayload();

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
      upcomingEvents = [];
      currentPage = 1;
      renderEventsPage();
   } finally {
      setEventsLoading(false);
   }
}

document.addEventListener("DOMContentLoaded", () => {
   const params = new URLSearchParams(window.location.search);
   currentPage = Number.parseInt(params.get("page") ?? "1", 10) || 1;
   loadUpcomingEvents();
});
