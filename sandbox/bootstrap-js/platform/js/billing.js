import { calculateInvoiceTotal, formatCurrencyPHP } from "./utils.js";

const BILLING_ITEMS_PER_PAGE = 6;
let billingData = [];
let billingCurrentPage = 1;

function getBillingStatusBadgeClass(status) {
   const value = String(status).trim().toLowerCase();

   if (value === "paid") {
      return "badge-paid";
   }

   if (value === "overdue") {
      return "badge-overdue";
   }

   return "badge-overdue";
}

function renderBillingRows(invoices) {
   const tableBody = document.getElementById("billing-table-body");

   if (!tableBody) {
      return;
   }

   tableBody.innerHTML = "";

   invoices.forEach((invoice, index) => {
      const isLast = index === invoices.length - 1;
      const borderClass = isLast ? "border-0" : "border-bottom border-secondary";
      const status = invoice.status ?? "Overdue";
      const statusClass = getBillingStatusBadgeClass(status);
      const amountClass = status.toLowerCase() === "overdue" ? "text-danger" : "text-white";

      const row = document.createElement("tr");
      row.innerHTML = `
         <td class="p-3 px-4 text-white font-monospace fw-bold ${borderClass}">${invoice.invoiceNumber}</td>
         <td class="p-3 px-4 text-secondary ${borderClass}">${invoice.organizer}</td>
         <td class="p-3 px-4 text-secondary ${borderClass}">${invoice.period}</td>
         <td class="p-3 px-4 fw-bold ${amountClass} ${borderClass}">${formatCurrencyPHP(invoice.amount ?? 0)}</td>
         <td class="p-3 px-4 ${borderClass}">
            <span class="badge ${statusClass} rounded-pill text-uppercase fw-bold p-2 px-3" style="font-size: 0.75rem;">${status}</span>
         </td>
      `;

      tableBody.appendChild(row);
   });
}

function updateBillingPagination() {
   const indicator = document.getElementById("billing-page-indicator");
   const totalPages = Math.max(1, Math.ceil(billingData.length / BILLING_ITEMS_PER_PAGE));

   if (indicator) {
      indicator.textContent = `Page ${billingCurrentPage} of ${totalPages}`;
   }
}

function renderBillingPage() {
   const start = (billingCurrentPage - 1) * BILLING_ITEMS_PER_PAGE;
   const end = start + BILLING_ITEMS_PER_PAGE;
   renderBillingRows(billingData.slice(start, end));
   updateBillingPagination();
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

         const totalPages = Math.max(1, Math.ceil(billingData.length / BILLING_ITEMS_PER_PAGE));
         if (billingCurrentPage < totalPages) {
            billingCurrentPage += 1;
            renderBillingPage();
         }
      });
   }
}

async function loadBillingData() {
   try {
      const response = await fetch("./data/billing-data.json");
      const data = await response.json();
      billingData = Array.isArray(data) ? data : [];
      billingCurrentPage = 1;
      renderBillingPage();
   } catch (error) {
      console.error("Failed to load billing data.", error);
   }
}

document.addEventListener("DOMContentLoaded", () => {
   const generateBtn = document.getElementById("btn-generate-invoice");

   initializeBillingPagination();
   loadBillingData();

   if (generateBtn) {
      generateBtn.addEventListener("click", () => {
         const organizerName =
            document.getElementById("invoice-organizer").value || "Generic Organizer";
         const targetCycle = document.getElementById("invoice-cycle").value || "Current Cycle";

         const mockAttendeeCount = 342;
         const mockRatePerAttendee = 150;

         const totalCalculated = calculateInvoiceTotal(mockAttendeeCount, mockRatePerAttendee);

         const formattedRate = formatCurrencyPHP(mockRatePerAttendee);
         const formattedTotal = formatCurrencyPHP(totalCalculated);

         document.getElementById("modal-org-name").textContent = organizerName;
         document.getElementById("modal-cycle").textContent = targetCycle;
         document.getElementById("modal-qty").textContent = mockAttendeeCount.toLocaleString();
         document.getElementById("modal-rate").textContent = formattedRate;
         document.getElementById("modal-line-total").textContent = formattedTotal;
         document.getElementById("modal-grand-total").textContent = formattedTotal;

         const invoiceModalEl = document.getElementById("invoiceModal");
         const modalInstance = new bootstrap.Modal(invoiceModalEl);
         modalInstance.show();
      });
   }
});

document.addEventListener("DOMContentLoaded", () => {
   const invoiceModalEl = document.getElementById("invoiceModal");
   const invoiceToastEl = document.getElementById("invoiceToast");

   if (invoiceModalEl && invoiceToastEl) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(invoiceModalEl);
      const toastInstance = bootstrap.Toast.getOrCreateInstance(invoiceToastEl);

      const confirmBtn = document.getElementById("btn-confirm-invoice");

      confirmBtn.addEventListener("click", () => {
         modalInstance.hide();

         setTimeout(() => {
            toastInstance.show();
         }, 150);
      });
   }
});
