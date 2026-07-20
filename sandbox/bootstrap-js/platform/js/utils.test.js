import { describe, it, expect } from "vitest";
import { calculateInvoiceTotal, formatCurrencyPHP } from "./utils.js";

describe("Invoice System Utilities", () => {
   describe("Invoice Total Calculations", () => {
      it("Handles missing rate gracefully", () => {
         expect(calculateInvoiceTotal(15)).toBe(0);
      });

      it("Calculates total with small rate", () => {
         expect(calculateInvoiceTotal(155, 1)).toBe(155);
      });

      it("Calculates basic multiplication", () => {
         expect(calculateInvoiceTotal(200, 2)).toBe(400);
      });

      it("Calculates standard totals", () => {
         expect(calculateInvoiceTotal(20, 20)).toBe(400);
      });

      it("Handles zero attendees", () => {
         expect(calculateInvoiceTotal(0, 150)).toBe(0);
      });
   });

   describe("Currency Formatting (PHP)", () => {
      // Note: \u20b1 represents the Philippine Peso symbol (₱)

      it("Formats zero", () => {
         expect(formatCurrencyPHP(0)).toBe("\u20b10.00");
      });

      it("Formats integer values", () => {
         expect(formatCurrencyPHP(20)).toBe("\u20b120.00");
      });

      it("Formats basic decimals", () => {
         expect(formatCurrencyPHP(20.99)).toBe("\u20b120.99");
      });

      it("Rounds repeating decimals up", () => {
         expect(formatCurrencyPHP(20.99999)).toBe("\u20b121.00");
      });

      it("Truncates insignificant decimals", () => {
         expect(formatCurrencyPHP(20.0001)).toBe("\u20b120.00");
      });

      it("Rounds midpoints up", () => {
         expect(formatCurrencyPHP(20.095)).toBe("\u20b120.10");
      });
   });
});
