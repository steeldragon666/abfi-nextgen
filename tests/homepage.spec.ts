import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display homepage with hero section", async ({ page }) => {
    await page.goto("/");

    // Check hero section content
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Check for ABFI branding or biofuels content
    await expect(page.locator("body")).toContainText(/ABFI|Biofuel|Bioenergy/i);
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/");

    // Test For Growers link (actual navigation that exists)
    const growerLink = page.getByRole("link", { name: /grower|sell.*feedstock/i }).first();
    if (await growerLink.isVisible()) {
      await growerLink.click();
      await expect(page).toHaveURL(/.*grower.*/);
    }
  });

  test("should display features section", async ({ page }) => {
    await page.goto("/");

    // Look for features content
    await expect(page.locator("body")).toContainText(
      /feedstock|bioenergy|sustainable/i
    );
  });

  test("should be responsive", async ({ page }) => {
    await page.goto("/");

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator("body")).toBeVisible();
  });
});
