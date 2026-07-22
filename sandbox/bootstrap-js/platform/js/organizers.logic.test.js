import { describe, expect, it } from "vitest";
import {
   buildOrganizersWithEventCounts,
   filterOrganizers,
   getStatusBadgeClass,
   paginateItems,
   validateCompanySearchQuery
} from "./organizers.logic.js";

describe("organizers.logic", () => {
   const organizers = [
      { organizerId: "org-1", companyName: "Initech PH", status: "Active" },
      { organizerId: "org-2", companyName: "Globex", status: "Suspended" }
   ];

   const events = {
      events: [{ organizerId: "org-1" }, { organizerId: "org-1" }, { organizerId: "org-2" }]
   };

   it("maps event counts to organizers", () => {
      const result = buildOrganizersWithEventCounts(organizers, events);

      expect(result[0].eventsCount).toBe(2);
      expect(result[1].eventsCount).toBe(1);
   });

   it("filters by company and status", () => {
      const withCounts = buildOrganizersWithEventCounts(organizers, events);

      expect(filterOrganizers(withCounts, "ini", "")).toHaveLength(1);
      expect(filterOrganizers(withCounts, "", "suspended")).toHaveLength(1);
      expect(filterOrganizers(withCounts, "glob", "suspended")).toHaveLength(1);
   });

   it("returns correct status badge classes", () => {
      expect(getStatusBadgeClass("active")).toBe("badge-active");
      expect(getStatusBadgeClass("pending")).toContain("badge-pending");
   });

   it("paginates results", () => {
      const withCounts = buildOrganizersWithEventCounts(organizers, events);
      const page = paginateItems(withCounts, 2, 1);

      expect(page.currentPage).toBe(2);
      expect(page.pageItems[0].organizerId).toBe("org-2");
   });

   it("validates query with minimum length", () => {
      expect(validateCompanySearchQuery("ab", 3).isValid).toBe(false);
      expect(validateCompanySearchQuery("abc", 3).isValid).toBe(true);
      expect(validateCompanySearchQuery("", 3).isValid).toBe(true);
   });
});
