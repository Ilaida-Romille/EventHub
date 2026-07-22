import { describe, expect, it } from "vitest";
import {
   buildMonthlyEventsFromSource,
   getMonthShortLabel,
   normalizeMonthlySeries
} from "./dashboard.logic.js";

describe("dashboard.logic", () => {
   it("returns month labels from a date", () => {
      expect(getMonthShortLabel("2026-08-01")).toBe("Aug");
      expect(getMonthShortLabel("invalid")).toBeNull();
   });

   it("builds monthly counts from event sources", () => {
      const result = buildMonthlyEventsFromSource(
         [
            { date: "2026-01-10" },
            { date: "2026-01-15" },
            { date: "2026-03-01" },
            { date: "2027-03-01" }
         ],
         2026
      );

      expect(result.labels[0]).toBe("Jan");
      expect(result.counts[0]).toBe(2);
      expect(result.counts[2]).toBe(1);
   });

   it("normalizes monthly series", () => {
      const normalized = normalizeMonthlySeries([
         { month: "Jan", count: 4 },
         { month: "Mar", count: 2 }
      ]);
      expect(normalized.counts[0]).toBe(4);
      expect(normalized.counts[1]).toBe(0);
      expect(normalized.counts[2]).toBe(2);
   });
});
