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
    const compareHref = await compareNow.getAttribute("href");
    expect(compareHref).toMatch(/\/compare\/?\?items=/);
    await page.goto(compareHref || "/compare");
    await expect(page.getByRole("heading", { name: /Compare selected workspace options/i })).toBeVisible();
  });

  test("compare page can add a selected product into quote cart", async ({ page }) => {
    await page.goto("/compare?items=oando-workstations--deskpro");
    await expect(page.getByRole("heading", { name: /Compare selected workspace options/i })).toBeVisible();
    await page.getByRole("button", { name: /Add to quote cart DeskPro/i }).click();
    await page.goto("/quote-cart");
    await expect(page.getByRole("heading", { name: /Quote cart built for procurement follow-through/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /DeskPro/i })).toBeVisible();
  });

  test("compare quote CTA preserves contact context", async ({ page }) => {
    await page.goto("/compare?items=oando-workstations--deskpro");
    await page.getByRole("link", { name: /Request quote/i }).click();
    await expect(page).toHaveURL(/\/contact\/?\?intent=quote&source=compare/);
    await expect(page.getByText(/Quote request from compared products/i)).toBeVisible();
    await expect(page.getByLabel(/Message/i)).toHaveValue(/products I compared/i);
  });

  test("legacy configurator route resolves to the active planner shell", async ({ page }) => {
    await page.goto("/configurator");
    await expect(page).toHaveURL(/\/planner\/?$/);
    await expect(page.getByRole("heading", { name: /Workspace Planner/i })).toBeVisible();
    await expect(page.getByText(/Room Snapshot/i)).toBeVisible();
  });

  test("planner keeps the global assistant quiet on the active route", async ({ page }) => {
    await page.goto("/planner");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }
    await expect(page.getByRole("button", { name: /open ai chatbot/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /open workspace assistant/i })).toHaveCount(0);
  });

  test("planner mobile keeps the main command surface visible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/planner");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    await expect(page.getByRole("button", { name: /^Reset$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Open 3D/i })).toBeVisible();
    await expect(page.getByText(/Catalog/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /open workspace assistant/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /open ai chatbot/i })).toHaveCount(0);
  });

  test("quote cart restores compare continuity when multiple products are present", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "quote-cart-v1",
        JSON.stringify({
          state: {
            items: [
              {
                id: "quote-oando-workstations--deskpro",
                name: "DeskPro",
                qty: 1,
                image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
                href: "/products/workstations/oando-workstations--deskpro",
              },
              {
                id: "quote-oando-workstations--curvivo",
                name: "Curvivo",
                qty: 1,
                image: "/images/catalog/oando-workstations--curvivo/image-1.webp",
                href: "/products/workstations/oando-workstations--curvivo",
              },
            ],
          },
          version: 0,
        }),
      );
    });

    await page.goto("/quote-cart");
    const compareSelected = page.getByRole("link", { name: /Compare selected/i }).first();
    await expect(compareSelected).toBeVisible();
    await expect(compareSelected).toHaveAttribute("href", /\/compare\/?\?items=/);
  });

  test("quote cart submit CTA preserves contact context", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "quote-cart-v1",
        JSON.stringify({
          state: {
            items: [
              {
                id: "quote-oando-workstations--deskpro",
                name: "DeskPro",
                qty: 1,
                image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
                href: "/products/workstations/oando-workstations--deskpro",
              },
            ],
          },
          version: 0,
        }),
      );
    });

    await page.goto("/quote-cart");
    await page.getByRole("link", { name: /Submit quote request/i }).click();
    await expect(page).toHaveURL(/\/contact\/?\?intent=quote&source=quote-cart/);
    await expect(page.getByText(/Quote request from saved cart/i)).toBeVisible();
    await expect(page.getByLabel(/Message/i)).toHaveValue(/quote cart/i);
  });
});
