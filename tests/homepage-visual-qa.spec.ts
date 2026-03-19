import { test, expect, type Page } from "@playwright/test";

type SectionMetric = {
  label: string;
  top: number;
  bottom: number;
  height: number;
};

async function acceptCookiesIfVisible(page: Page) {
  const acceptCookies = page.getByRole("button", { name: /Accept All/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }
}

test.describe("Homepage visual QA", () => {
  test("desktop rhythm and footer transition stay coherent", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await acceptCookiesIfVisible(page);

    const metrics = await page.evaluate(() => {
      const findSectionByHeading = (text: string) => {
        const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
        const heading = headings.find((node) => node.textContent?.replace(/\s+/g, " ").includes(text));
        return heading?.closest("section") ?? null;
      };

      const elements = [
        {
          label: "hero",
          element: document.querySelector("main section"),
        },
        {
          label: "partnership",
          element: findSectionByHeading("Authorized Franchise Partner"),
        },
        {
          label: "trust",
          element: document.querySelector("section[aria-label='Trust indicators']"),
        },
        {
          label: "solutions",
          element: findSectionByHeading("Start with the workspace requirement"),
        },
        {
          label: "projects",
          element: document.querySelector(".projects-section"),
        },
        {
          label: "collections",
          element: findSectionByHeading("Browse product categories"),
        },
        {
          label: "process",
          element: findSectionByHeading("A clear delivery system"),
        },
        {
          label: "close",
          element: document.querySelector(".contact-teaser")?.closest("section"),
        },
        {
          label: "footer",
          element: document.querySelector("footer.site-footer"),
        },
      ];

      return elements.map(({ label, element }) => {
        if (!(element instanceof HTMLElement)) {
          return { label, missing: true };
        }
        const rect = element.getBoundingClientRect();
        return {
          label,
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          height: rect.height,
        };
      });
    });

    const missing = metrics.filter((item) => "missing" in item);
    expect(missing).toEqual([]);

    const ordered = metrics as SectionMetric[];
    for (let index = 1; index < ordered.length; index += 1) {
      expect(ordered[index].top).toBeGreaterThanOrEqual(ordered[index - 1].top);
    }

    const close = ordered.find((item) => item.label === "close");
    const footer = ordered.find((item) => item.label === "footer");
    expect(close).toBeTruthy();
    expect(footer).toBeTruthy();
    expect((footer?.top ?? 0) - (close?.bottom ?? 0)).toBeLessThanOrEqual(2);

    await page.screenshot({
      path: "output/playwright/home-visual-qa-desktop.png",
      fullPage: true,
    });
  });

  test("mobile close and footer remain readable after the layout pass", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await acceptCookiesIfVisible(page);

    const closeHeading = page.getByRole("heading", { name: /Start with one clear brief/i });
    await closeHeading.scrollIntoViewIfNeeded();
    await expect(closeHeading).toBeVisible();

    const closeMetrics = await page.locator(".contact-teaser").evaluate((node) => {
      const actions = Array.from(node.querySelectorAll<HTMLElement>(".contact-teaser__action"));
      const rect = node.getBoundingClientRect();
      return {
        width: rect.width,
        actionCount: actions.length,
        actionMinHeight: actions.reduce(
          (smallest, action) => Math.min(smallest, action.getBoundingClientRect().height),
          Number.POSITIVE_INFINITY,
        ),
      };
    });

    expect(closeMetrics.actionCount).toBe(2);
    expect(closeMetrics.width).toBeGreaterThan(300);
    expect(closeMetrics.actionMinHeight).toBeGreaterThan(55);

    await page.screenshot({
      path: "output/playwright/home-visual-qa-mobile.png",
      fullPage: true,
    });
  });
});
