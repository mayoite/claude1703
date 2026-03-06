import { test, expect } from "@playwright/test";

test.describe("Homepage conversion path", () => {
  test("renders core sections in conversion order", async ({ page }) => {
    await page.goto("/");

    const hero = page.getByRole("heading", { name: /Spaces that/i }).first();
    const trust = page.getByLabel("Trust indicators");
    const solutions = page.getByRole("heading", {
      name: /Choose products by workspace need/i,
    });
    const experience = page.getByRole("heading", { name: /Execution strength at scale/i });
    const process = page.getByRole("heading", { name: /A clear four-step delivery system/i });
    const contact = page.getByRole("heading", {
      name: /Choose how you want to start/i,
    });

    const ordered = [hero, trust, solutions, experience, process, contact];

    let previousY = -1;
    for (const locator of ordered) {
      await expect(locator).toBeVisible();
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      const y = box?.y ?? 0;
      expect(y).toBeGreaterThan(previousY);
      previousY = y;
    }
  });

  test("submits guided planner intake from homepage", async ({ page }) => {
    let payload: any = null;

    await page.route("**/api/customer-queries", async (route) => {
      payload = route.request().postDataJSON() || null;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ success: true, queryId: "HQ-1001" }),
      });
    });

    await page.goto("/");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    await page.getByLabel("Open guided planner").click();
    const guidedDialog = page.getByRole("dialog", { name: /Guided planner/i });
    await expect(guidedDialog).toBeVisible();
    await guidedDialog.getByRole("button", { name: /Workstations/i }).click();
    await guidedDialog.getByPlaceholder("Seats/units (e.g. 60 workstations)").fill("45 workstations");
    await guidedDialog.getByRole("button", { name: /Continue/i }).click();
    await guidedDialog.getByPlaceholder("City and state").fill("Patna, Bihar");
    await guidedDialog.getByRole("button", { name: /1-3 months/i }).click();
    await guidedDialog.getByRole("button", { name: /Continue/i }).click();
    await guidedDialog.getByPlaceholder("Your name").fill("Ayush");
    await guidedDialog.getByPlaceholder("Work email").fill("ayush@example.com");
    await guidedDialog.getByRole("button", { name: /Finish/i }).click();

    await expect(page.getByText(/Intake submitted/i)).toBeVisible();
    if (!payload) {
      throw new Error("Expected a customer query payload to be captured");
    }
    expect(payload.source).toBe("homepage-chatbot");
    expect(payload.sourcePath).toBe("/");
  });

  test("showrooms page renders journey and trust content", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/showrooms");
    await expect(page.getByRole("heading", { name: /Showrooms, journey, and client delivery/i })).toBeVisible();
    await expect(page.getByText(/Trusted at a glance/i)).toBeVisible();
    await expect(page.getByText(/Clients we have served/i)).toBeVisible();
  });
});
