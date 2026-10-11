import { describe, expect, it } from "vitest";
import { salonSite, verticalLabels } from "./site-config";

describe("starter site configuration", () => {
  it("contains the essential content for a salon landing page", () => {
    expect(salonSite.services.length).toBeGreaterThanOrEqual(3);
    expect(salonSite.values.length).toBeGreaterThanOrEqual(3);
    expect(salonSite.location).toBeTruthy();
    expect(salonSite.phone).toMatch(/^\+/);
  });

  it("keeps future verticals explicit and extensible", () => {
    expect(verticalLabels.clinic).toContain("Clinics");
    expect(verticalLabels.restaurant).toContain("Restaurants");
  });
});
