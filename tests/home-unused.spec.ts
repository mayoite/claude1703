import { expect, test } from "@playwright/test";

test.describe("Archive preview route", () => {
  test("renders grouped archive previews and pending salvage guidance", async ({ page }) => {
    await page.goto("/home-unused");

    await expect(
      page.getByRole("heading", { name: /Unused Archive Preview/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Legacy marketing surfaces/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Reusable UI wrappers and layout blocks/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Usability reference surfaces/i }),
    ).toBeVisible();
    await expect(page.getByText(/Pending salvage list/i)).toBeVisible();

    const quickJump = page.getByRole("link", { name: /Archived Configurator Layout Shell/i });
    await expect(quickJump).toBeVisible();
    await quickJump.click();

    const archivedConfiguratorBlock = page.locator("#archived-configurator-layout-shell");
    await expect(archivedConfiguratorBlock).toBeVisible();
    await expect(
      archivedConfiguratorBlock.getByText(/Split preview with a persistent planning summary/i),
    ).toBeVisible();
  });

  test("supports verdict filtering for salvage-now archive blocks", async ({ page }) => {
    await page.goto("/home-unused?verdict=salvage-now");

    await expect(page.getByText(/Showing 2 of/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Archived Configurator Layout Shell/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Legacy AI Advisor/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Hero Carousel/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Configurator shell structure/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /3D viewer fallback surface/i })).toHaveCount(0);
    await expect(page.getByText(/Salvage now/i).first()).toBeVisible();
  });

  test("supports text filtering by archive source path", async ({ page }) => {
    await page.goto("/home-unused?q=3DViewer");

    await expect(page.getByText(/Showing 1 of/i)).toBeVisible();
    await expect(page.getByText(/Search: 3DViewer/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Archived 3D Viewer/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Legacy AI Advisor/i })).toHaveCount(0);
  });
});
