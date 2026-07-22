import { getPlatformBillingPayload } from "../../js/api/data-api.js";
import { calculateInvoiceTotal, formatCurrencyPHP } from "./billing.helpers.js";
import {
   buildBillingViewModel,
   buildOrganizerInvoiceOptions,
   filterInvoices,
   getBillingStatusBadgeClass,
   paginateItems
} from "./billing.logic.js";
import { getResponsiveItemsPerPage, shouldRecomputePageSize } from "./pagination.js";

const BILLING_PAGE_SIZE = {
   mobile: 4,
   desktop: 6
};
const BASE_RATE_PER_ATTENDEE = 200;
let allInvoices = [];
let visibleInvoices = [];
let billingCurrentPage = 1;
let organizerAttendeeCountById = new Map();
let currentViewportWidth = window.innerWidth;

function createCell(className, textValue) {
   const cell = document.createElement("td");
   cell.className = className;
   cell.textContent = textValue;
   return cell;
}

function getItemsPerPage() {
   return getResponsiveItemsPerPage(window.innerWidth, BILLING_PAGE_SIZE);
}

function renderBillingRows(invoices) {
   const tableBody = document.getElementById("billing-table-body");

   if (!tableBody) {
      return;
   }

   tableBody.replaceChildren();

   if (!Array.isArray(invoices) || invoices.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.className = "p-4 text-center text-secondary";
      cell.textContent = "No billing entries found.";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
   }

   invoices.forEach((invoice, index) => {
      const isLast = index === invoices.length - 1;
      const borderClass = isLast ? "border-0" : "border-bottom border-secondary";
      const status = invoice.status ?? "Overdue";
      const statusClass = getBillingStatusBadgeClass(status);
      const amountClass = status.toLowerCase() === "overdue" ? "text-danger" : "text-white";

      const row = document.createElement("tr");
      row.appendChild(
         createCell(
            `p-3 px-4 text-white font-monospace fw-bold ${borderClass}`,
            String(invoice.invoiceNumber ?? "N/A")
         )
      );
      row.appendChild(
         createCell(
            `p-3 px-4 text-secondary ${borderClass}`,
            String(invoice.organizer ?? "Unknown Organizer")
         )
      );
      row.appendChild(
         createCell(`p-3 px-4 text-secondary ${borderClass}`, String(invoice.period ?? "N/A"))
      );
      row.appendChild(
         createCell(
            `p-3 px-4 fw-bold ${amountClass} ${borderClass}`,
            formatCurrencyPHP(invoice.amount ?? 0)
         )
      );

      const statusCell = document.createElement("td");
      statusCell.className = `p-3 px-4 ${borderClass}`;
      const statusBadge = document.createElement("span");
      statusBadge.className = `badge ${statusClass} rounded-pill text-uppercase fw-bold p-2 px-3`;
      statusBadge.style.fontSize = "0.75rem";
      statusBadge.textContent = status;
      statusCell.appendChild(statusBadge);
      row.appendChild(statusCell);

      tableBody.appendChild(row);
   });
}

function updateBillingPagination(totalPages) {
   const indicator = document.getElementById("billing-page-indicator");

   if (indicator) {
      indicator.textContent = `Page ${billingCurrentPage} of ${totalPages}`;
   }
}

function renderBillingPage() {
   const pageData = paginateItems(visibleInvoices, billingCurrentPage, getItemsPerPage());
   billingCurrentPage = pageData.currentPage;
   renderBillingRows(pageData.pageItems);
   updateBillingPagination(pageData.totalPages);
}

function initializeBillingPagination() {
   const prevBtn = document.getElementById("billing-prev-page");
   const nextBtn = document.getElementById("billing-next-page");

   if (prevBtn) {
      prevBtn.addEventListener("click", (event) => {
         event.preventDefault();

         if (billingCurrentPage > 1) {
            billingCurrentPage -= 1;
            renderBillingPage();
         }
      });
   }

   if (nextBtn) {
      nextBtn.addEventListener("click", (event) => {
         event.preventDefault();

         const totalPages = Math.max(1, Math.ceil(visibleInvoices.length / getItemsPerPage()));
         if (billingCurrentPage < totalPages) {
            billingCurrentPage += 1;
            renderBillingPage();
         }
      });
   }
}

function initializeResponsivePagination() {
   window.addEventListener("resize", () => {
      const nextWidth = window.innerWidth;

      if (shouldRecomputePageSize(currentViewportWidth, nextWidth)) {
         renderBillingPage();
      }

      currentViewportWidth = nextWidth;
   });
}

function setBillingLoading(isLoading) {
   const searchBtn = document.getElementById("billing-search-btn");
   const generateBtn = document.getElementById("btn-generate-invoice");
   const tableBody = document.getElementById("billing-table-body");
   const organizerToggle = document.getElementById("invoice-organizer-toggle");

   if (searchBtn) {
      searchBtn.disabled = isLoading;
   }

   if (generateBtn) {
      generateBtn.disabled = isLoading;
   }

   if (organizerToggle) {
      organizerToggle.disabled = isLoading;
   }

   if (tableBody) {
      tableBody.setAttribute("aria-busy", String(isLoading));
   }
}

function setSearchFeedback(message) {
   const feedback = document.getElementById("billing-search-feedback");

   if (feedback) {
      feedback.textContent = message;
   }
}

function applyBillingFilters() {
   const query = document.getElementById("billing-search-query")?.value ?? "";
   const fromDate = document.getElementById("billing-from-date")?.value ?? "";
   const toDate = document.getElementById("billing-to-date")?.value ?? "";
   const normalizedQuery = String(query).trim();

   if (normalizedQuery && normalizedQuery.length < 3) {
      setSearchFeedback("Enter at least 3 characters to search by organizer or invoice number.");
      return;
   }

   if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setSearchFeedback('"From date" cannot be later than "To date."');
      return;
   }

   visibleInvoices = filterInvoices(allInvoices, {
      query: normalizedQuery,
      fromDate,
      toDate
   });

   setSearchFeedback("");
   billingCurrentPage = 1;
   renderBillingPage();
}

function initializeBillingSearch() {
   const form = document.getElementById("billing-search-form");

   if (!form) {
      return;
   }

   form.addEventListener("submit", (event) => {
      event.preventDefault();
      applyBillingFilters();
   });
}

function createOrganizerMenuItem(option, onSelect) {
   const listItem = document.createElement("li");
   const button = document.createElement("button");
   button.type = "button";
   button.className = "dropdown-item py-2";

   const companyName = document.createElement("span");
   companyName.className = "d-block fw-semibold";
   companyName.textContent = option.organizerName;

   const invoiceNumber = document.createElement("small");
   invoiceNumber.className = "d-block text-secondary";
   invoiceNumber.textContent = option.primaryInvoiceNumber;

   button.appendChild(companyName);
   button.appendChild(invoiceNumber);

   button.addEventListener("click", () => onSelect(option));
   listItem.appendChild(button);

   return listItem;
}

function toTargetCycle(issuedAt) {
   if (!issuedAt) {
      return "";
   }

   const date = new Date(issuedAt);

   if (Number.isNaN(date.getTime())) {
      return "";
   }

   const month = String(date.getUTCMonth() + 1).padStart(2, "0");
   const year = String(date.getUTCFullYear()).slice(-2);
   return `${month}/${year}`;
}

function setSelectedOrganizer(option) {
   const selectedInput = document.getElementById("invoice-organizer");
   const toggleLabel = document.getElementById("invoice-organizer-toggle-label");
   const cycleInput = document.getElementById("invoice-cycle");

   if (selectedInput) {
      selectedInput.value = option?.organizerId ?? "";
   }

   if (toggleLabel) {
      if (!option) {
         toggleLabel.className = "text-secondary";
         toggleLabel.textContent = "Select organizer";

         if (cycleInput) {
            cycleInput.value = "";
         }

         return;
      }

      toggleLabel.className = "d-flex flex-column";

      const companyName = document.createElement("span");
      companyName.className = "fw-semibold text-white";
      companyName.textContent = option.organizerName;

      const invoiceNumber = document.createElement("small");
      invoiceNumber.className = "text-secondary";
      invoiceNumber.textContent = option.primaryInvoiceNumber;

      toggleLabel.replaceChildren(companyName, invoiceNumber);

      if (cycleInput) {
         cycleInput.value = toTargetCycle(option.latestIssuedAt);
      }
   }
}

function populateOrganizerDropdown() {
   const organizerMenu = document.getElementById("invoice-organizer-menu");

   if (!organizerMenu) {
      return;
   }

   const options = buildOrganizerInvoiceOptions(allInvoices);
   organizerMenu.replaceChildren();

   options.forEach((option) => {
      organizerMenu.appendChild(
         createOrganizerMenuItem(option, (selectedOption) => {
            setSelectedOrganizer(selectedOption);
         })
      );
   });

   setSelectedOrganizer(options[0] ?? null);
}

function renderInvoicePreview() {
   const organizerId = document.getElementById("invoice-organizer")?.value ?? "";
   const selectedInvoice = allInvoices.find((invoice) => invoice.organizerId === organizerId);

   if (!selectedInvoice) {
      return;
   }

   const attendeeCount = Number(organizerAttendeeCountById.get(organizerId) ?? 0);
   const totalCalculated = calculateInvoiceTotal(attendeeCount, BASE_RATE_PER_ATTENDEE);
   const formattedRate = formatCurrencyPHP(BASE_RATE_PER_ATTENDEE);
   const formattedTotal = formatCurrencyPHP(totalCalculated);

   document.getElementById("modal-org-name").textContent = selectedInvoice.organizer;
   document.getElementById("modal-invoice-number").textContent = String(
      selectedInvoice.invoiceNumber ?? "N/A"
   );
   document.getElementById("modal-qty").textContent = attendeeCount.toLocaleString();
   document.getElementById("modal-rate").textContent = formattedRate;
   document.getElementById("modal-line-total").textContent = formattedTotal;
   document.getElementById("modal-grand-total").textContent = formattedTotal;

   const invoiceModalEl = document.getElementById("invoiceModal");
   const modalInstance = bootstrap.Modal.getOrCreateInstance(invoiceModalEl);
   modalInstance.show();
}

function initializeInvoiceActions() {
   const generateBtn = document.getElementById("btn-generate-invoice");

   if (generateBtn) {
      generateBtn.addEventListener("click", renderInvoicePreview);
   }

   const invoiceModalEl = document.getElementById("invoiceModal");
   const invoiceToastEl = document.getElementById("invoiceToast");
   const confirmBtn = document.getElementById("btn-confirm-invoice");

   if (invoiceModalEl && invoiceToastEl && confirmBtn) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(invoiceModalEl);
      const toastInstance = bootstrap.Toast.getOrCreateInstance(invoiceToastEl);

      confirmBtn.addEventListener("click", () => {
         modalInstance.hide();

         setTimeout(() => {
            toastInstance.show();
         }, 150);
      });
   }
}

async function loadBillingData() {
   setBillingLoading(true);

   try {
      const [billingRows, organizersData, upcomingEventsData] = await getPlatformBillingPayload();

      const viewModel = buildBillingViewModel(
         billingRows,
         organizersData,
         upcomingEventsData,
         BASE_RATE_PER_ATTENDEE
      );

      allInvoices = viewModel.invoices;
      visibleInvoices = [...allInvoices];
      organizerAttendeeCountById = viewModel.attendeeCountByOrganizerId;
      billingCurrentPage = 1;

      renderBillingPage();
      populateOrganizerDropdown();
   } catch (error) {
      console.error("Failed to load billing data.", error);
      allInvoices = [];
      visibleInvoices = [];
      billingCurrentPage = 1;
      renderBillingPage();
      setSelectedOrganizer(null);
   } finally {
      setBillingLoading(false);
   }
}

document.addEventListener("DOMContentLoaded", () => {
   initializeBillingPagination();
   initializeResponsivePagination();
   initializeBillingSearch();
   initializeInvoiceActions();
   loadBillingData();
});
