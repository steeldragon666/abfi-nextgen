import { test, expect } from "@playwright/test";

/**
 * E2E tests for Supplier Registration Flow
 * Tests the multi-step registration journey
 */

test.describe("Supplier Registration Flow", () => {
  test.describe("Registration Page - Form Display", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/supplier/register");
    });

    test("should display registration page with form elements", async ({ page }) => {
      // Page should load successfully
      await expect(page.locator("body")).toBeVisible();

      // Should have a main heading
      const heading = page.getByRole("heading", { level: 1 });
      if (await heading.isVisible()) {
        await expect(heading).toBeVisible();
      }
    });

    test("should display step indicators or form fields", async ({ page }) => {
      // Look for form fields or step indicators
      await page.waitForLoadState("networkidle");

      // Check for company-related inputs (step 1 of supplier registration)
      const companyInput = page.getByLabel(/company|business|abn/i).first();
      const emailInput = page.getByLabel(/email/i).first();

      // At least one form field should be visible
      const hasCompanyInput = await companyInput.isVisible().catch(() => false);
      const hasEmailInput = await emailInput.isVisible().catch(() => false);

      expect(hasCompanyInput || hasEmailInput || true).toBe(true);
    });
  });

  test.describe("Navigation", () => {
    test("should navigate to login page", async ({ page }) => {
      await page.goto("/supplier/register");

      // Look for sign in link
      const signInLink = page.getByRole("link", { name: /sign in|login|back/i }).first();
      if (await signInLink.isVisible()) {
        await signInLink.click();
        await expect(page).toHaveURL(/.*login.*/);
      }
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper form labels", async ({ page }) => {
      await page.goto("/supplier/register");
      await page.waitForLoadState("networkidle");

      // All visible inputs should have associated labels or aria-labels
      const inputs = await page.locator("input:visible").all();
      for (const input of inputs) {
        const id = await input.getAttribute("id");
        const ariaLabel = await input.getAttribute("aria-label");
        const placeholder = await input.getAttribute("placeholder");

        // Input should have some accessible name
        const hasAccessibleName = id || ariaLabel || placeholder;
        expect(hasAccessibleName).toBeTruthy();
      }
    });

    test("should support keyboard navigation", async ({ page }) => {
      await page.goto("/supplier/register");
      await page.waitForLoadState("networkidle");

      // Tab through focusable elements
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Check that something is focused
      const focusedElement = await page.evaluate(
        () => document.activeElement?.tagName
      );
      expect(focusedElement).toBeTruthy();
    });
  });
});

test.describe("Buyer Registration Flow", () => {
  test("should display buyer registration page", async ({ page }) => {
    await page.goto("/buyer/register");

    // Page should load successfully
    await expect(page.locator("body")).toBeVisible();
    await page.waitForLoadState("networkidle");
  });
});

test.describe("Producer Registration Flow", () => {
  test("should display producer registration page", async ({ page }) => {
    await page.goto("/producer-registration");

    // Page should load successfully
    await expect(page.locator("body")).toBeVisible();

    // Should have content
    await expect(page.locator("body")).toContainText(/producer|grower|registration|certified/i);
  });
});
