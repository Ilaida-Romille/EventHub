import { calculateInvoiceTotal, formatCurrencyPHP } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
   const generateBtn = document.getElementById("btn-generate-invoice");

   if (generateBtn) {
      generateBtn.addEventListener("click", () => {
         const organizerName =
            document.getElementById("invoice-organizer").value || "Generic Organizer";
         const targetCycle = document.getElementById("invoice-cycle").value || "Current Cycle";

         const mockAttendeeCount = 340;
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
