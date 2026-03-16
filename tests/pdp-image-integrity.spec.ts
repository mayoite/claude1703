import { expect, test } from "@playwright/test";

const ROUTES = [
  "/products/seating/oando-seating--breeze/",
  "/products/seating/oando-soft-seating--brim/",
  "/products/seating/oando-seating--wing/",
];

test.describe("PDP image integrity", () => {
  for (const route of ROUTES) {
    test(`${route} has no broken visible images`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);

      const broken = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("img"))
          .filter((img) => Boolean(img.offsetParent))
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.currentSrc || img.src || "");
      });

      expect(
        broken,
        `Broken visible images on ${route}: ${broken.join(", ") || "none"}`,
      ).toEqual([]);
    });
  }
});
