import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchJson } from "./client.js";

afterEach(() => {
   vi.restoreAllMocks();
});

describe("api/client", () => {
   it("returns parsed JSON when response is ok", async () => {
      const mockResponse = {
         ok: true,
         json: vi.fn().mockResolvedValue({ ok: true })
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      const result = await fetchJson("/x");
      expect(result).toEqual({ ok: true });
   });

   it("throws an HTTP error when response is not ok", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

      await expect(fetchJson("/x")).rejects.toThrow("HTTP 500");
   });
});
