import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/products", "/products/seating", "/contact", "/quote-cart"];

async function settleForA11y(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForFunction(
    () => document.readyState === "interactive" || document.readyState === "complete",
  );
  await page.waitForTimeout(300);

  // Guard against transient blank-document states during client navigation.
  await page
    .waitForFunction(() => {
      const lang = document.documentElement.getAttribute("lang");
      const title = document.title;
      return Boolean(lang && title && title.trim().length > 0);
    }, { timeout: 10000 })
    .catch(() => {});
}

async function runAxe(page: Page) {
  const build = () =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .disableRules(["color-contrast"])
      .analyze();

  try {
    return await build();
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    if (!message.includes("execution context was destroyed")) {
      throw error;
    }

    await settleForA11y(page);
    return build();
  }
}

test.describe("Accessibility Smoke", () => {
  for (const route of ROUTES) {
    test(`axe scan: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await settleForA11y(page);

      const results = await runAxe(page);

      const criticalOrSerious = results.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact || ""),
      );

      expect(
        criticalOrSerious,
        `${route} has critical/serious accessibility violations`,
      ).toEqual([]);
    });
  }

  test("axe scan: product detail route", async ({ page }) => {
    await page.goto("/products/seating", { waitUntil: "domcontentloaded", timeout: 60000 });
    await settleForA11y(page);

    const firstProductLink = page.locator("a[href^='/products/seating/']").first();
    await expect(firstProductLink).toBeVisible();
    const href = await firstProductLink.getAttribute("href");
    expect(href, "Expected a product detail href").toBeTruthy();
    await page.goto(href as string, { waitUntil: "domcontentloaded", timeout: 60000 });
    await settleForA11y(page);

    const results = await runAxe(page);

    const criticalOrSerious = results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact || ""),
    );

    expect(
      criticalOrSerious,
      "Product detail route has critical/serious accessibility violations",
    ).toEqual([]);
  });
});
