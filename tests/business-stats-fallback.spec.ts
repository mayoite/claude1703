import { expect, test } from "@playwright/test";

test("business stats source follows expected fallback", async ({ request }) => {
  const expectedSource = process.env.EXPECT_SOURCE;
  expect(expectedSource, "EXPECT_SOURCE env var must be provided").toBeTruthy();

  const response = await request.get("/api/business-stats?live=1");
  expect(response.status()).toBe(200);

  const payload = (await response.json()) as {
    source?: string;
    stats?: {
      projectsDelivered?: number;
      clientOrganisations?: number;
    };
  };

  expect(payload.source).toBe(expectedSource);
  expect(typeof payload.stats?.projectsDelivered).toBe("number");
  expect(typeof payload.stats?.clientOrganisations).toBe("number");
});
