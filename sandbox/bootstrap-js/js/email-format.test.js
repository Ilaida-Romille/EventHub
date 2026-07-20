import { describe, it, expect } from "vitest";
import { isLikelyValidEmail } from "./email-format.js";

describe("Email Validation Logic", () => {
   describe("Happy Path Tests", () => {
      it("Accepts standard corporate email", () => {
         expect(isLikelyValidEmail("john@company.com")).toBe(true);
      });

      it("Accepts platform domain email", () => {
         expect(isLikelyValidEmail("admin@eventhub.com")).toBe(true);
      });

      it("Accepts complex tags and subdomains", () => {
         expect(isLikelyValidEmail("user.name+tag@sub.domain.org")).toBe(true);
      });

      it("Trims surrounding whitespace automatically", () => {
         expect(isLikelyValidEmail("   spaces_trimmed@domain.com  ")).toBe(true);
      });
   });

   describe("Edge Cases / Failure Mode Tests", () => {
      it("Rejects plain text without symbols", () => {
         expect(isLikelyValidEmail("plain-text")).toBe(false);
      });

      it("Rejects email missing local part", () => {
         expect(isLikelyValidEmail("@missing-local.com")).toBe(false);
      });

      it("Rejects email missing domain identifier", () => {
         expect(isLikelyValidEmail("missing-domain@.com")).toBe(false);
      });

      it("Rejects emails containing multiple @ signs", () => {
         expect(isLikelyValidEmail("two@@signs.com")).toBe(false);
      });

      it("Rejects explicit internal whitespace characters", () => {
         expect(isLikelyValidEmail("spaces in@email.com")).toBe(false);
      });

      it("Rejects top-level domains under 2 letters", () => {
         expect(isLikelyValidEmail("bad-tld@domain.c")).toBe(false);
      });
   });

   describe("Type Safety Tests", () => {
      it("Handles empty string entries safely", () => {
         expect(isLikelyValidEmail("")).toBe(false);
      });

      it("Handles absolute null types safely", () => {
         expect(isLikelyValidEmail(null)).toBe(false);
      });

      it("Handles undefined parameter fields safely", () => {
         expect(isLikelyValidEmail(undefined)).toBe(false);
      });
   });
});
