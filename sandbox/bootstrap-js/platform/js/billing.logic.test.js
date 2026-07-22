import { describe, expect, it } from "vitest";
import {
   buildBillingViewModel,
   buildOrganizerInvoiceOptions,
   filterInvoices,
   paginateItems
} from "./billing.logic.js";

describe("billing.logic", () => {
   const billingRows = [
      { organizerId: "org-1", invoiceNumber: "INV-1001", issuedAt: "2026-05-18T10:00:00Z" },
      { organizerId: "org-2", invoiceNumber: "INV-2001", issuedAt: "2026-05-19T10:00:00Z" }
   ];

   const organizers = [
      { organizerId: "org-1", companyName: "Initech PH" },
      { organizerId: "org-2", companyName: "Initrode Inc" }
   ];

   const events = {
      events: [
         { organizerId: "org-1", capacityUsed: 10 },
         { organizerId: "org-1", capacityUsed: 5 },
         { organizerId: "org-2", capacityUsed: 4 }
      ]
   };

   it("builds billing rows with organizer names and computed totals", () => {
      const result = buildBillingViewModel(billingRows, organizers, events, 200);

      expect(result.invoices[0].organizer).toBe("Initech PH");
      expect(result.invoices[0].attendeeCount).toBe(15);
      expect(result.invoices[0].amount).toBe(3000);
   });

   it("filters by organizer and invoice number only", () => {
      const result = buildBillingViewModel(billingRows, organizers, events, 200);

      expect(filterInvoices(result.invoices, { query: "initech" })).toHaveLength(1);
      expect(filterInvoices(result.invoices, { query: "inv-2001" })).toHaveLength(1);
   });

   it("filters by date range", () => {
      const result = buildBillingViewModel(billingRows, organizers, events, 200);

      expect(
         filterInvoices(result.invoices, {
            fromDate: "2026-05-19",
            toDate: "2026-05-30"
         })
      ).toHaveLength(1);
   });

   it("filters by month range using YYYY-MM values", () => {
      const result = buildBillingViewModel(billingRows, organizers, events, 200);

      expect(
         filterInvoices(result.invoices, {
            fromDate: "2026-05",
            toDate: "2026-05"
         })
      ).toHaveLength(2);

      expect(
         filterInvoices(result.invoices, {
            fromDate: "2026-06",
            toDate: "2026-06"
         })
      ).toHaveLength(0);
   });

   it("builds organizer dropdown options mapped to invoice numbers", () => {
      const result = buildBillingViewModel(billingRows, organizers, events, 200);
      const options = buildOrganizerInvoiceOptions(result.invoices);

      expect(options[0].primaryInvoiceNumber).toContain("INV-");
      expect(options).toHaveLength(2);
   });

   it("paginates invoices", () => {
      const result = buildBillingViewModel(billingRows, organizers, events, 200);
      const page = paginateItems(result.invoices, 1, 1);

      expect(page.pageItems).toHaveLength(1);
      expect(page.totalPages).toBe(2);
   });
});
