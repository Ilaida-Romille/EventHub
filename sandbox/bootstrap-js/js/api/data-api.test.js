import { afterEach, describe, expect, it, vi } from "vitest";
import {
   getPlatformBillingPayload,
   getPlatformDashboardPayload,
   getPlatformDashboardData
} from "./data-api.js";

afterEach(() => {
   vi.restoreAllMocks();
});

describe("api/data-api", () => {
   it("loads dashboard data endpoint", async () => {
      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ kpis: {} })
         })
      );

      const result = await getPlatformDashboardData();
      expect(result).toEqual({ kpis: {} });
   });

   it("composes billing payload calls", async () => {
      vi.stubGlobal(
         "fetch",
         vi
            .fn()
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue([]) })
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue([]) })
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ events: [] }) })
      );

      const result = await getPlatformBillingPayload();
      expect(result).toHaveLength(3);
   });

   it("composes dashboard payload calls", async () => {
      vi.stubGlobal(
         "fetch",
         vi
            .fn()
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ kpis: {} }) })
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ events: [] }) })
      );

      const result = await getPlatformDashboardPayload();
      expect(result).toHaveLength(2);
   });
});
