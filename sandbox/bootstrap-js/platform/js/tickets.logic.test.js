import { describe, expect, it } from "vitest";
import {
   getRelativeOpenedText,
   getStatusClass,
   paginateTickets,
   resolveActiveTicketId
} from "./tickets.logic.js";

describe("tickets.logic", () => {
   it("formats relative opened text", () => {
      const now = new Date("2026-07-22T00:00:00Z");
      expect(getRelativeOpenedText("2026-07-22T00:00:00Z", now)).toBe("today");
      expect(getRelativeOpenedText("2026-07-21T00:00:00Z", now)).toBe("1 day ago");
   });

   it("maps status to class", () => {
      expect(getStatusClass("Open")).toBe("badge-open");
      expect(getStatusClass("In Progress")).toBe("badge-progress");
   });

   it("resolves active id from page subset", () => {
      const page = [{ id: "T1" }, { id: "T2" }];
      expect(resolveActiveTicketId(page, "T2")).toBe("T2");
      expect(resolveActiveTicketId(page, "T3")).toBe("T1");
   });

   it("paginates tickets", () => {
      const result = paginateTickets([1, 2, 3], 2, 2);
      expect(result.pageItems).toEqual([3]);
   });
});
