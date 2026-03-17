import { expect, test } from "@playwright/test";

function expectParam(urlString: string, key: string, expected: string) {
  const url = new URL(urlString, "http://localhost:3000");
  expect(url.searchParams.getAll(key)).toContain(expected);
}

function expectFromContainsFilters(urlString: string, expected: Record<string, string>) {
  const url = new URL(urlString, "http://localhost:3000");
  const fromParam = url.searchParams.get("from");
  expect(fromParam).toBeTruthy();

  const from = new URLSearchParams(fromParam || "");
  for (const [key, value] of Object.entries(expected)) {
    expect(from.get(key)).toBe(value);
  }
}

test.describe("Dynamic Filters", () => {
  test("hydrates from URL filters and keeps shareable state", async ({ page, context }) => {
    const sharedPath = "/products/seating?price=mid&mat=mesh&ecoMin=6&sort=ecoDesc";

    await page.goto(sharedPath);
    await expect(page.getByRole("textbox", { name: "Search Seating" })).toBeVisible();
    await expect(page).toHaveURL(/price=mid/);

    await expect(page.getByText(/eco >= 6/i)).toBeVisible();
    await expect(page.getByLabel("Sort products")).toHaveValue("ecoDesc");

    const sharedUrl = page.url();
    const secondPage = await context.newPage();
    await secondPage.goto(sharedUrl);
    await expect(secondPage).toHaveURL(/price=mid/);

    await expect(secondPage.getByText(/eco >= 6/i)).toBeVisible();
    await expect(secondPage.getByLabel("Sort products")).toHaveValue("ecoDesc");
  });

  test("sustainability filter updates URL and can be cleared", async ({ page }) => {
    await page.goto("/products/seating?ecoMin=6");
    await expect(page.getByRole("textbox", { name: "Search Seating" })).toBeVisible();

    await expect(page).toHaveURL(/ecoMin=6/);
    await expect(page.getByText(/eco >= 6/i)).toBeVisible();

    const activeFiltersSection = page.locator("div.border-b.border-neutral-100").filter({
      hasText: /Active filters/i,
    });
    await activeFiltersSection.getByRole("button", { name: /clear all/i }).click();
    await expect(page).not.toHaveURL(/ecoMin=6/);
  });

  test("product detail carries from context and breadcrumb returns to filtered list", async ({
    page,
  }) => {
    const fromQuery = "q=phoenix";
    const detailUrl = `/products/seating/oando-seating--phoenix?from=${encodeURIComponent(fromQuery)}`;
    await page.goto(detailUrl);
    await expect(page).toHaveURL(/\/products\/seating\/[^/?]+/);
    await expect(page).toHaveURL(/from=/);
    expectFromContainsFilters(page.url(), { q: "phoenix" });

    const breadcrumbCategoryLink = page.locator("main a[href*='/products/seating']").first();
    await expect(breadcrumbCategoryLink).toBeVisible();
    await breadcrumbCategoryLink.click();

    await expect(page).toHaveURL(/\/products\/seating\/?\?/);
    const returnedUrl = page.url();
    expectParam(returnedUrl, "q", "phoenix");
  });
});
