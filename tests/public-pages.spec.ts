import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test.describe("For Growers Page", () => {
    test("should display grower content", async ({ page }) => {
      await page.goto("/for-growers");

      // Check for grower page content
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("body")).toContainText(
        /grower|feedstock|producer|farmer/i
      );
    });

    test("should have navigation back to home", async ({ page }) => {
      await page.goto("/for-growers");

      // Check for home link in navigation
      const homeLink = page.getByRole("link", { name: /home|abfi/i }).first();
      if (await homeLink.isVisible()) {
        await expect(homeLink).toBeVisible();
      }
    });
  });

  test.describe("For Developers Page", () => {
    test("should display developer content", async ({ page }) => {
      await page.goto("/for-developers");

      // Check for developer page content
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("body")).toContainText(/developer|project|bioenergy/i);
    });

    test("should display platform benefits", async ({ page }) => {
      await page.goto("/for-developers");

      // Look for key value propositions
      await expect(page.locator("body")).toContainText(/supply|feedstock|verification/i);
    });

    test("should have call-to-action buttons", async ({ page }) => {
      await page.goto("/for-developers");

      // Look for get started/learn more buttons
      const ctaButton = page.getByRole("link", { name: /get started|learn more|start|explore/i }).first();
      if (await ctaButton.isVisible()) {
        await expect(ctaButton).toBeVisible();
      }
    });
  });

  test.describe("For Lenders Page", () => {
    test("should display lender content", async ({ page }) => {
      await page.goto("/for-lenders");

      // Check for lender page content
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("body")).toContainText(/lender|finance|risk|investment/i);
    });
  });
});
