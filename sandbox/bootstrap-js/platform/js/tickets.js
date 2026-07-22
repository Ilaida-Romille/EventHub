import { getPlatformTicketsPayload } from "../../js/api/data-api.js";
import {
   getRelativeOpenedText,
   getStatusClass,
   paginateTickets,
   resolveActiveTicketId
} from "./tickets.logic.js";
import { getResponsiveItemsPerPage, shouldRecomputePageSize } from "./pagination.js";

const TICKETS_PAGE_SIZE = {
   mobile: 3,
   desktop: 5
};
let ticketsData = [];
let ticketsCurrentPage = 1;
let selectedTicketId = null;
let currentViewportWidth = window.innerWidth;

function getItemsPerPage() {
   return getResponsiveItemsPerPage(window.innerWidth, TICKETS_PAGE_SIZE);
}

function renderActiveTicket(ticket) {
   const title = document.getElementById("active-ticket-title");
   const status = document.getElementById("active-ticket-status");
   const company = document.getElementById("active-ticket-company");
   const opened = document.getElementById("active-ticket-opened");
   const message = document.getElementById("active-ticket-message");
   const responseInput = document.getElementById("helpdesk-response");

   if (!ticket || !title || !status || !company || !opened || !message) {
      return;
   }

   title.textContent = `${ticket.id} - ${ticket.title}`;
   status.textContent = ticket.status;
   status.className = `status-badge ${getStatusClass(ticket.status)} align-self-start align-self-sm-auto`;
   company.textContent = ticket.company;
   opened.textContent = ticket.openedAgo;
   message.textContent = `"${ticket.message}"`;

   if (responseInput) {
      responseInput.value = "";
   }
}

function buildTicketItem(ticket, isActive) {
   const ticketItem = document.createElement("div");
   ticketItem.className = `ticket-item text-start ${isActive ? "active" : ""}`;
   ticketItem.setAttribute("role", "button");
   ticketItem.setAttribute("tabindex", "0");

   const topRow = document.createElement("div");
   topRow.className = "d-flex justify-content-between align-items-center mb-2";

   const ticketId = document.createElement("span");
   ticketId.className = "ticket-id";
   ticketId.textContent = ticket.id;

   const status = document.createElement("span");
   status.className = `status-badge ${getStatusClass(ticket.status)}`;
   status.textContent = ticket.status;

   topRow.appendChild(ticketId);
   topRow.appendChild(status);

   const company = document.createElement("div");
   company.className = "text-secondary mb-2";
   company.style.fontSize = "0.85rem";
   company.textContent = ticket.company;

   const title = document.createElement("div");
   title.className = "text-white fw-semibold";
   title.style.fontSize = "1rem";
   title.textContent = ticket.title;

   ticketItem.appendChild(topRow);
   ticketItem.appendChild(company);
   ticketItem.appendChild(title);

   return ticketItem;
}

function renderTicketsList(tickets, activeTicketId) {
   const container = document.getElementById("tickets-container");

   if (!container) {
      return;
   }

   container.replaceChildren();

   tickets.forEach((ticket) => {
      const ticketItem = buildTicketItem(ticket, ticket.id === activeTicketId);

      const activateTicket = () => {
         selectedTicketId = ticket.id;
         renderActiveTicket(ticket);

         const allItems = container.querySelectorAll(".ticket-item");
         allItems.forEach((item) => item.classList.remove("active"));
         ticketItem.classList.add("active");
      };

      ticketItem.addEventListener("click", activateTicket);
      ticketItem.addEventListener("keydown", (event) => {
         if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activateTicket();
         }
      });

      container.appendChild(ticketItem);
   });
}

function updateTicketsPagination(totalPages) {
   const indicator = document.getElementById("tickets-page-indicator");

   if (indicator) {
      indicator.textContent = `Page ${ticketsCurrentPage} of ${totalPages}`;
   }
}

function renderTicketsPage() {
   const pageData = paginateTickets(ticketsData, ticketsCurrentPage, getItemsPerPage());
   ticketsCurrentPage = pageData.currentPage;

   const activeTicketInPage = resolveActiveTicketId(pageData.pageItems, selectedTicketId);

   renderTicketsList(pageData.pageItems, activeTicketInPage);

   if (activeTicketInPage) {
      const ticket = ticketsData.find((entry) => entry.id === activeTicketInPage);
      renderActiveTicket(ticket);
      selectedTicketId = activeTicketInPage;
   }

   updateTicketsPagination(pageData.totalPages);
}

function initializeTicketsPagination() {
   const prevBtn = document.getElementById("tickets-prev-page");
   const nextBtn = document.getElementById("tickets-next-page");

   if (prevBtn) {
      prevBtn.addEventListener("click", (event) => {
         event.preventDefault();

         if (ticketsCurrentPage > 1) {
            ticketsCurrentPage -= 1;
            renderTicketsPage();
         }
      });
   }

   if (nextBtn) {
      nextBtn.addEventListener("click", (event) => {
         event.preventDefault();

         const totalPages = Math.max(1, Math.ceil(ticketsData.length / getItemsPerPage()));
         if (ticketsCurrentPage < totalPages) {
            ticketsCurrentPage += 1;
            renderTicketsPage();
         }
      });
   }
}

function initializeResponsivePagination() {
   window.addEventListener("resize", () => {
      const nextWidth = window.innerWidth;

      if (shouldRecomputePageSize(currentViewportWidth, nextWidth)) {
         renderTicketsPage();
      }

      currentViewportWidth = nextWidth;
   });
}

function initializeActions() {
   const form = document.querySelector("form");
   const resolveButton = document.querySelector("button.btn-success");

   if (form) {
      form.addEventListener("submit", (event) => {
         event.preventDefault();
      });
   }

   if (resolveButton) {
      resolveButton.addEventListener("click", () => {
         const status = document.getElementById("active-ticket-status");

         if (status) {
            status.textContent = "Resolved";
            status.className = "status-badge badge-resolved align-self-start align-self-sm-auto";
         }
      });
   }
}

function setTicketsLoading(isLoading) {
   const container = document.getElementById("tickets-container");

   if (container) {
      container.setAttribute("aria-busy", String(isLoading));
   }
}

async function loadTicketsData() {
   setTicketsLoading(true);

   try {
      const [data, organizersData] = await getPlatformTicketsPayload();

      const organizersMap = new Map(
         (Array.isArray(organizersData) ? organizersData : []).map((organizer) => [
            organizer.organizerId,
            organizer
         ])
      );

      ticketsData = (Array.isArray(data.tickets) ? data.tickets : []).map((ticket) => ({
         ...ticket,
         company: organizersMap.get(ticket.organizerId)?.companyName ?? "Unknown Organizer",
         openedAgo: getRelativeOpenedText(ticket.createdAt)
      }));

      selectedTicketId =
         ticketsData.find((ticket) => ticket.id === data.activeTicketId)?.id ?? ticketsData[0]?.id;
      ticketsCurrentPage = 1;

      renderTicketsPage();
   } catch (error) {
      console.error("Failed to load tickets data.", error);
      ticketsData = [];
      ticketsCurrentPage = 1;
      selectedTicketId = null;
      renderTicketsPage();
   } finally {
      setTicketsLoading(false);
   }
}

document.addEventListener("DOMContentLoaded", () => {
   initializeTicketsPagination();
   initializeResponsivePagination();
   initializeActions();
   loadTicketsData();
});
