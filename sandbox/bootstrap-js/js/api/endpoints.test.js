import { describe, expect, it } from "vitest";
import { API_ENDPOINTS } from "./endpoints.js";

describe("api/endpoints", () => {
   it("contains platform and user endpoint groups", () => {
      expect(API_ENDPOINTS.platform.dashboard).toBe("/platform/data/dashboard-data.json");
      expect(API_ENDPOINTS.users.upcomingEvents).toBe("/users/data/upcoming-events-data.json");
   });
});
