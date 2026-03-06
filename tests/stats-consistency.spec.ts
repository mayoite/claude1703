import { expect, test } from "@playwright/test";

type BusinessStatsResponse = {
  stats: {
    projectsDelivered: number;
    clientOrganisations: number;
    sectorsServed: number;
  };
  source: "supabase" | "nhost-backup" | "stale-cache" | "safe-default";
};

function plus(value: number) {
  return `${new Intl.NumberFormat("en-IN").format(value)}+`;
}

test.describe("KPI consistency", () => {
  test("homepage and projects page use the same KPI source", async ({ page }) => {
    const apiResponse = await page.request.get("/api/business-stats");
    expect(apiResponse.status()).toBe(200);

    const payload = (await apiResponse.json()) as BusinessStatsResponse;
    expect(["supabase", "nhost-backup", "stale-cache", "safe-default"]).toContain(
      payload.source,
    );

    await page.goto("/");

    await expect(page.getByTestId("kpi-projects-delivered")).toHaveText(
      plus(payload.stats.projectsDelivered),
    );
    await expect(page.getByTestId("kpi-client-organisations")).toHaveText(
      plus(payload.stats.clientOrganisations),
    );
    await expect(page.getByTestId("kpi-as-of-home")).toContainText("As of");

    await page.goto("/projects");

    await expect(page.getByTestId("kpi-projects-delivered-projects")).toHaveText(
      plus(payload.stats.projectsDelivered),
    );
    await expect(page.getByTestId("kpi-client-organisations-projects")).toHaveText(
      plus(payload.stats.clientOrganisations),
    );
    await expect(page.getByTestId("kpi-sectors-served-projects")).toHaveText(
      plus(payload.stats.sectorsServed),
    );
    await expect(page.getByTestId("kpi-as-of-projects")).toContainText("As of");

    await expect(page.locator("body")).not.toContainText("500+ Projects Delivered");
    await expect(page.locator("body")).not.toContainText("60+ Client Organisations");
  });
});
