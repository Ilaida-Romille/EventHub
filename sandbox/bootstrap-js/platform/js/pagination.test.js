import { describe, expect, it } from "vitest";
import {
   getResponsiveItemsPerPage,
   isMobileViewport,
   paginateItems,
   shouldRecomputePageSize
} from "./pagination.js";

describe("pagination", () => {
   it("detects viewport buckets", () => {
      expect(isMobileViewport(500)).toBe(true);
      expect(isMobileViewport(1200)).toBe(false);
   });

   it("returns responsive page sizes", () => {
      const config = { mobile: 3, desktop: 6 };
      expect(getResponsiveItemsPerPage(600, config)).toBe(3);
      expect(getResponsiveItemsPerPage(900, config)).toBe(6);
   });

   it("paginates safely", () => {
      const result = paginateItems([1, 2, 3, 4], 2, 2);
      expect(result.pageItems).toEqual([3, 4]);
      expect(result.totalPages).toBe(2);
   });

   it("recomputes only when crossing breakpoint", () => {
      expect(shouldRecomputePageSize(500, 540)).toBe(false);
      expect(shouldRecomputePageSize(500, 800)).toBe(true);
   });
});
