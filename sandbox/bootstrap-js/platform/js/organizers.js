import { getPlatformOrganizersPayload } from "../../js/api/data-api.js";
import {
   buildOrganizersWithEventCounts,
   filterOrganizers,
   getStatusBadgeClass,
   paginateItems,
   validateCompanySearchQuery
} from "./organizers.logic.js";
import { getResponsiveItemsPerPage, shouldRecomputePageSize } from "./pagination.js";

const ORGANIZERS_PAGE_SIZE = {
   mobile: 4,
   desktop: 6
};
let allOrganizers = [];
let filteredOrganizers = [];
let organizersCurrentPage = 1;
let currentViewportWidth = window.innerWidth;

function getItemsPerPage() {
   return getResponsiveItemsPerPage(window.innerWidth, ORGANIZERS_PAGE_SIZE);
}

function createCell(className, textValue) {
   const cell = document.createElement("td");
   cell.className = className;
   cell.textContent = textValue;
   return cell;
}

function renderOrganizersTable(organizers) {
   const tableBody = document.getElementById("organizers-table-body");

   if (!tableBody) {
      return;
   }

   tableBody.replaceChildren();

   if (!Array.isArray(organizers) || organizers.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.className = "p-4 text-center text-secondary";
      cell.textContent = "No organizer entries found.";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
   }

   organizers.forEach((organizer, index) => {
      const isLast = index === organizers.length - 1;
      const borderClass = isLast ? "border-0" : "border-bottom border-secondary";

      const row = document.createElement("tr");
      row.appendChild(
         createCell(
            `p-3 px-4 text-white ${borderClass}`,
            String(organizer.companyName ?? "Unknown")
         )
      );
      row.appendChild(
         createCell(
            `p-3 px-4 text-white ${borderClass}`,
            Number(organizer.eventsCount ?? 0).toLocaleString()
         )
      );

      const statusCell = document.createElement("td");
      statusCell.className = `p-3 px-4 ${borderClass}`;
      const statusBadge = document.createElement("span");
      statusBadge.className = `badge ${getStatusBadgeClass(organizer.status)} rounded-pill text-uppercase fw-bold p-2 px-3`;
      statusBadge.style.fontSize = "0.75rem";
      statusBadge.textContent = String(organizer.status ?? "Pending");
      statusCell.appendChild(statusBadge);
      row.appendChild(statusCell);

      const actionCell = document.createElement("td");
      actionCell.className = `p-3 px-4 table-actions text-secondary ${borderClass}`;

      const viewLink = document.createElement("a");
      viewLink.href = "#";
      viewLink.textContent = "View Details";

      const separator = document.createTextNode(" | ");

      const changeStatusLink = document.createElement("a");
      changeStatusLink.href = "#";
      changeStatusLink.textContent = "Change Status";

      actionCell.appendChild(viewLink);
      actionCell.appendChild(separator);
      actionCell.appendChild(changeStatusLink);
      row.appendChild(actionCell);

      tableBody.appendChild(row);
   });
}

function updateOrganizersPagination(totalPages) {
   const indicator = document.getElementById("organizers-page-indicator");

   if (indicator) {
      indicator.textContent = `Page ${organizersCurrentPage} of ${totalPages}`;
   }
}

function renderOrganizersPage() {
   const pageData = paginateItems(filteredOrganizers, organizersCurrentPage, getItemsPerPage());
   organizersCurrentPage = pageData.currentPage;
   renderOrganizersTable(pageData.pageItems);
   updateOrganizersPagination(pageData.totalPages);
}

function initializeOrganizersPagination() {
   const prevBtn = document.getElementById("organizers-prev-page");
   const nextBtn = document.getElementById("organizers-next-page");

   if (prevBtn) {
      prevBtn.addEventListener("click", (event) => {
         event.preventDefault();

         if (organizersCurrentPage > 1) {
            organizersCurrentPage -= 1;
            renderOrganizersPage();
         }
      });
   }

   if (nextBtn) {
      nextBtn.addEventListener("click", (event) => {
         event.preventDefault();

         const totalPages = Math.max(1, Math.ceil(filteredOrganizers.length / getItemsPerPage()));
         if (organizersCurrentPage < totalPages) {
            organizersCurrentPage += 1;
            renderOrganizersPage();
         }
      });
   }
}

function initializeResponsivePagination() {
   window.addEventListener("resize", () => {
      const nextWidth = window.innerWidth;

      if (shouldRecomputePageSize(currentViewportWidth, nextWidth)) {
         renderOrganizersPage();
      }

      currentViewportWidth = nextWidth;
   });
}

function setOrganizersLoading(isLoading) {
   const tableBody = document.getElementById("organizers-table-body");
   const searchBtn = document.getElementById("organizers-search-btn");

   if (tableBody) {
      tableBody.setAttribute("aria-busy", String(isLoading));
   }

   if (searchBtn) {
      searchBtn.disabled = isLoading;
   }
}

function setSearchFeedback(message) {
   const feedback = document.getElementById("organizers-search-feedback");

   if (feedback) {
      feedback.textContent = message;
   }
}

function applyOrganizerFilters() {
   const queryInput = document.getElementById("organizers-search-query");
   const statusSelect = document.getElementById("organizers-status-filter");

   const queryValidation = validateCompanySearchQuery(queryInput?.value ?? "", 3);

   if (!queryValidation.isValid) {
      setSearchFeedback(queryValidation.message);
      return;
   }

   filteredOrganizers = filterOrganizers(
      allOrganizers,
      queryValidation.normalizedQuery,
      statusSelect?.value ?? ""
   );

   setSearchFeedback("");
   organizersCurrentPage = 1;
   renderOrganizersPage();
}

function initializeOrganizerFilters() {
   const form = document.getElementById("organizers-filter-form");

   if (form) {
      form.addEventListener("submit", (event) => {
         event.preventDefault();
         applyOrganizerFilters();
      });
   }
}

async function loadOrganizersData() {
   setOrganizersLoading(true);

   try {
      const [organizersRows, upcomingEventsData] = await getPlatformOrganizersPayload();
      allOrganizers = buildOrganizersWithEventCounts(organizersRows, upcomingEventsData);
      filteredOrganizers = [...allOrganizers];
      organizersCurrentPage = 1;
      renderOrganizersPage();
   } catch (error) {
      console.error("Failed to load organizers data.", error);
      allOrganizers = [];
      filteredOrganizers = [];
      organizersCurrentPage = 1;
      renderOrganizersPage();
   } finally {
      setOrganizersLoading(false);
   }
}

document.addEventListener("DOMContentLoaded", () => {
   initializeOrganizersPagination();
   initializeResponsivePagination();
   initializeOrganizerFilters();
   loadOrganizersData();
});
