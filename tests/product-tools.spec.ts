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
    await page.getByRole("button", { name: /technical planner/i }).click();
    await page.getByLabel("Series").selectOption("Panel Series");
    await page.getByLabel("Layout").selectOption("cluster-4");
    await page.getByLabel("Screen height (mm)").selectOption("530");
    await page.getByLabel("Raceway").selectOption("spine");
    await page.getByLabel("Room width (mm)").fill("9000");
    await page.getByLabel("Room length (mm)").fill("14000");
    await page.getByRole("button", { name: /jump to review/i }).click();
    await page.getByPlaceholder("End client (optional)").fill("Acme Global");
    await page.getByPlaceholder("Your name").fill("Ayush");
    await page.getByPlaceholder("Work email").fill("ayush@example.com");
    await page.getByRole("button", { name: /Submit configuration/i }).click();

    await expect(page.getByText(/Configuration sent. Reference: CFG-2201/i)).toBeVisible();
    expect(payload).toBeTruthy();
    expect(String(payload?.message ?? "")).toContain("Room size:");
    expect(String(payload?.message ?? "")).toContain("End client: Acme Global");
    expect(String(payload?.message ?? "")).toContain("Mode: technical-planner");
  });

  test("configurator keeps global assistant quiet and sends snapshot-aware copilot payload", async ({
    page,
  }) => {
    let advisorPayload: Record<string, unknown> | undefined;

    await page.route("**/api/ai-advisor/**", async (route) => {
      advisorPayload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          recommendations: [
            {
              productUrlKey: "oando-workstations--deskpro",
              productId: "oando-workstations--deskpro",
              productName: "DeskPro",
              category: "workstations",
              why: "Keeps the footprint compact while preserving modular growth.",
              budgetEstimate: "Indicative band after review",
            },
          ],
          totalBudget: "INR band after review",
          summary: "The current snapshot is workable if you keep density controlled.",
          nextActions: ["Compare one lower-budget benching option."],
          warnings: ["Budget remains indicative until the BOQ review."],
          pricingMode: "band",
        }),
      });
    });

    await page.goto("/configurator");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }
    await expect(page.getByRole("button", { name: /open ai chatbot/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /open workspace assistant/i })).toHaveCount(0);
    await page.getByRole("button", { name: /use current snapshot/i }).click();
    await expect(page.getByText(/Indicative budget: INR band after review/i)).toBeVisible();
    expect(advisorPayload).toBeTruthy();
    expect(advisorPayload?.context).toMatchObject({
      source: "configurator",
      mode: "quick-estimate",
      projectType: "workstations",
    });
  });

  test("configurator mobile keeps review path visible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/configurator");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    await expect(page.getByRole("button", { name: /Review and submit/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /open workspace assistant/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /open ai chatbot/i })).toHaveCount(0);
    await page.getByRole("button", { name: /Review and submit/i }).click();
    await expect(page.getByText(/Final review and submission/i)).toBeVisible();
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
