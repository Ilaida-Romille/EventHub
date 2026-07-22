import { describe, expect, it } from "vitest";
import { calculateInvoiceTotal, formatCurrencyPHP } from "./billing.helpers.js";

describe("billing.helpers", () => {
   it("calculates invoice totals safely", () => {
      expect(calculateInvoiceTotal(15, 200)).toBe(3000);
      expect(calculateInvoiceTotal(undefined, 200)).toBe(0);
      expect(calculateInvoiceTotal(15, undefined)).toBe(0);
   });

   it("formats PHP currency", () => {
      expect(formatCurrencyPHP(0)).toBe("\u20b10.00");
      expect(formatCurrencyPHP(99.995)).toBe("\u20b1100.00");
   });
});
