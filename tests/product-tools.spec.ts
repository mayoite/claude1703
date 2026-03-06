import { expect, test } from "@playwright/test";

test.describe("Product tools", () => {
  test("compare flow works from category page", async ({ page }) => {
    await page.goto("/products/workstations");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    const compareButton = page.getByRole("button", { name: /compare|added/i }).first();
    await expect(compareButton).toBeVisible();
    await compareButton.click();

    const compareNow = page.getByRole("link", { name: /compare now/i });
    await expect(compareNow).toBeVisible();
    await compareNow.click();

    await expect(page).toHaveURL(/\/compare\/\?items=/);
    await expect(
      page.getByRole("heading", { name: /Compare workstation and storage options/i }),
    ).toBeVisible();
  });

  test("workstation module configurator submits enquiry", async ({ page }) => {
    let payload: Record<string, unknown> | undefined;

    await page.route("**/api/customer-queries", async (route) => {
      payload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ success: true, queryId: "CFG-2201" }),
      });
    });

    await page.goto("/configurator");
    await expect(page.getByRole("img", { name: /rough workstation drawing/i })).toBeVisible();
    await page.getByLabel("Series").selectOption("Panel Series");
    await page.getByLabel("Layout").selectOption("cluster-4");
    await page.getByLabel("Screen height (mm)").selectOption("530");
    await page.getByLabel("Raceway").selectOption("spine");
    await page.getByLabel("Room width (mm)").fill("9000");
    await page.getByLabel("Room length (mm)").fill("14000");
    await page.getByPlaceholder("End client (optional)").fill("Acme Global");
    await page.getByPlaceholder("Your name").fill("Ayush");
    await page.getByPlaceholder("Work email").fill("ayush@example.com");
    await page.getByRole("button", { name: /Submit configuration/i }).click();

    await expect(page.getByText(/Configuration sent. Reference: CFG-2201/i)).toBeVisible();
    expect(payload).toBeTruthy();
    expect(String(payload?.message ?? "")).toContain("Room size:");
    expect(String(payload?.message ?? "")).toContain("End client: Acme Global");
  });
});
