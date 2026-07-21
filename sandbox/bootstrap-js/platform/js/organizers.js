const ORGANIZERS_ITEMS_PER_PAGE = 6;
let organizersData = [];
let organizersCurrentPage = 1;

function getStatusBadgeClass(status) {
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

function renderOrganizersTable(organizers) {
   const tableBody = document.getElementById("organizers-table-body");

   if (!tableBody) {
      return;
   }

   tableBody.innerHTML = "";

   organizers.forEach((organizer, index) => {
      const isLast = index === organizers.length - 1;
      const borderClass = isLast ? "border-0" : "border-bottom border-secondary";

      const row = document.createElement("tr");
      row.innerHTML = `
         <td class="p-3 px-4 text-white ${borderClass}">${organizer.companyName}</td>
         <td class="p-3 px-4 text-white ${borderClass}">${Number(organizer.eventsCount ?? 0).toLocaleString()}</td>
         <td class="p-3 px-4 ${borderClass}">
            <span class="badge ${getStatusBadgeClass(organizer.status)} rounded-pill text-uppercase fw-bold p-2 px-3" style="font-size: 0.75rem;">${organizer.status}</span>
         </td>
         <td class="p-3 px-4 table-actions text-secondary ${borderClass}">
            <a href="#">View Details</a> &nbsp;|&nbsp; <a href="#">Change Status</a>
         </td>
      `;

      tableBody.appendChild(row);
   });
}

function updateOrganizersPagination() {
   const indicator = document.getElementById("organizers-page-indicator");
   const totalPages = Math.max(1, Math.ceil(organizersData.length / ORGANIZERS_ITEMS_PER_PAGE));

   if (indicator) {
      indicator.textContent = `Page ${organizersCurrentPage} of ${totalPages}`;
   }
}

function renderOrganizersPage() {
   const start = (organizersCurrentPage - 1) * ORGANIZERS_ITEMS_PER_PAGE;
   const end = start + ORGANIZERS_ITEMS_PER_PAGE;
   renderOrganizersTable(organizersData.slice(start, end));
   updateOrganizersPagination();
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

         const totalPages = Math.max(
            1,
            Math.ceil(organizersData.length / ORGANIZERS_ITEMS_PER_PAGE)
         );
         if (organizersCurrentPage < totalPages) {
            organizersCurrentPage += 1;
            renderOrganizersPage();
         }
      });
   }
}

document.addEventListener("DOMContentLoaded", async () => {
   try {
      const response = await fetch("./data/organizers-data.json");
      const data = await response.json();
      organizersData = Array.isArray(data) ? data : [];
      organizersCurrentPage = 1;
      initializeOrganizersPagination();
      renderOrganizersPage();
   } catch (error) {
      console.error("Failed to load organizers data.", error);
   }
});
