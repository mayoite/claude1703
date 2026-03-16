import { test, expect } from "@playwright/test";

test.describe("Homepage conversion path", () => {
  test("renders core sections in conversion order", async ({ page }) => {
    await page.goto("/");

    const hero = page.getByRole("heading", { name: /Spaces that/i }).first();
    const partnership = page.getByRole("heading", {
      name: /Authorized Franchise Partner/i,
    });
    const deliveries = page.getByRole("heading", { name: /Recent projects/i });
    const process = page.getByRole("heading", { name: /A clear delivery system/i });
    const trust = page.getByLabel("Trust indicators");
    const contact = page.getByRole("heading", { name: /Start with one clear brief/i });

    const ordered = [hero, partnership, deliveries, process, trust, contact];

    let previousY = -1;
    for (const locator of ordered) {
      await expect(locator).toBeVisible();
      const y = await locator.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      });
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

    await expect(page.getByLabel("Open AI chatbot")).toBeVisible({ timeout: 10000 });
    const openGuidedPlanner = page.getByRole("button", { name: /Open guided planner/i }).first();
    await openGuidedPlanner.scrollIntoViewIfNeeded();
    await expect(openGuidedPlanner).toBeVisible({ timeout: 10000 });
    await openGuidedPlanner.click();
    const guidedDialog = page.getByRole("dialog", { name: /Guided planner/i });
    await expect(guidedDialog).toBeVisible({ timeout: 10000 });
    await guidedDialog.getByRole("button", { name: /Workstations/i }).click();
    await guidedDialog
      .getByPlaceholder("Seats or units (e.g. 60 workstations)")
      .fill("45 workstations");
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

  test("projects cards keep only sector and company name", async ({ page }) => {
    await page.goto("/");

    const projectsSection = page.locator(".projects-section");
    await expect(projectsSection.getByRole("heading", { name: /Recent projects/i })).toBeVisible();
    await expect(projectsSection.getByText("Corporate")).toBeVisible();
    await expect(projectsSection.getByText("Titan Limited")).toBeVisible();
    await expect(projectsSection.getByText("Patna, Bihar")).toHaveCount(0);
    await expect(projectsSection.getByText("New Delhi")).toHaveCount(0);
    await expect(projectsSection.getByText("Titan Office")).toHaveCount(0);
  });

  test("homepage chatbot uses global advisor context and supports reset", async ({ page }) => {
    let advisorPayload: Record<string, unknown> | null = null;

    await page.route("**/api/ai-advisor/**", async (route) => {
      advisorPayload = (route.request().postDataJSON() as Record<string, unknown>) || null;
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
              why: "Balanced for teams that need modular rollout speed.",
              budgetEstimate: "Indicative band after review",
            },
          ],
          totalBudget: "Indicative band after review",
          summary: "This shortlist fits a practical first-pass workspace brief.",
          nextActions: ["Confirm delivery timeline and team density."],
          warnings: ["Pricing remains indicative until project review."],
          pricingMode: "band",
        }),
      });
    });

    await page.goto("/");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    await page.getByLabel("Open AI chatbot").click();
    const chatbotDialog = page.getByRole("dialog", { name: /AI chatbot/i });
    await expect(chatbotDialog).toBeVisible();
    await chatbotDialog.getByRole("button", { name: /Recommend workstations for a 60-person operations team in Patna./i }).click();
    await expect(chatbotDialog.getByText(/Indicative band after review/i)).toBeVisible();
    await expect(chatbotDialog.getByText(/Pricing remains indicative until project review./i)).toBeVisible();
    await expect(chatbotDialog.getByRole("button", { name: /Start a new query/i })).toBeVisible();
    await chatbotDialog.getByRole("button", { name: /Start a new query/i }).click();
    await expect(chatbotDialog.getByText(/Hi, I am your workspace AI assistant/i)).toBeVisible();

    expect(advisorPayload).not.toBeNull();
    expect(advisorPayload?.context).toMatchObject({
      source: "global",
      sourcePath: "/",
    });
  });

  test("showrooms page renders journey and trust content", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/showrooms");
    await expect(page.getByRole("heading", { name: /Showrooms, journey, and client delivery/i })).toBeVisible();
    await expect(page.getByText(/Trusted at a glance/i)).toBeVisible();
    await expect(page.getByText(/Clients we have served/i)).toBeVisible();
  });

  test("process cards keep dark text on light surface", async ({ page }) => {
    await page.goto("/");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    const processHeading = page.getByRole("heading", {
      name: /A clear delivery system/i,
    });
    await processHeading.scrollIntoViewIfNeeded();

    const styles = await page.locator(".home-step-card").first().evaluate((el) => {
      const title = el.querySelector("p");
      return {
        background: getComputedStyle(el).backgroundColor,
        title: title ? getComputedStyle(title).color : "",
      };
    });

    expect(styles.background).toBe("rgb(255, 255, 255)");
    expect(styles.title).not.toBe("rgb(255, 255, 255)");
  });

  test("homepage uses one closing conversion surface instead of two stacked asks", async ({
    page,
  }) => {
    await page.goto("/");
    const acceptCookies = page.getByRole("button", { name: /Accept All/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    await expect(
      page.getByRole("heading", { name: /Start with one clear brief/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Need a human response/i }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Email us/i }),
    ).toHaveCount(0);
  });

  test("desktop header search submits the top product result on Enter", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const searchInput = page.getByLabel("Search products with AI");
    await expect(searchInput).toBeVisible();
    await searchInput.click();
    await searchInput.fill("desk");

    const firstResultLink = page.locator(".shell-search-panel a[href^='/products/']").first();
    await expect(firstResultLink).toBeVisible({ timeout: 10000 });
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/\/products\/[^/]+\/[^/?]+\/?$/);
  });

  test("mobile drawer search submits the best match on Enter", async ({ page }) => {
    await page.route("**/api/nav-search*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: "category:workstations",
              title: "Workstations",
              href: "/products/workstations",
              type: "category",
              source: "local",
            },
          ],
          fallbackUsed: false,
          rankingMode: "local",
        }),
      });
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu/i }).click();
    const drawer = page.getByRole("dialog", { name: /Mobile navigation/i });
    const searchInput = page.getByLabel("Mobile AI product search");
    await searchInput.fill("work");
    await expect(drawer.getByRole("link", { name: "Workstations" }).first()).toBeVisible();
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/\/products\/workstations\/?$/);
  });
});
