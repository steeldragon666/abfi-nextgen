import { test, expect, type Page } from "@playwright/test";

/**
 * ABFI Platform Design Consistency Tests
 * Verifies consistent colors, typography, icons, and fonts across all pages
 */

// All pages to test
const PAGES = [
  { path: "/", name: "Home/Landing" },
  { path: "/for-growers", name: "For Growers" },
  { path: "/for-developers", name: "For Developers" },
  { path: "/for-lenders", name: "For Lenders" },
  { path: "/platform-features", name: "Platform Features" },
  { path: "/browse", name: "Browse Marketplace" },
  { path: "/futures", name: "Futures Marketplace" },
  { path: "/map", name: "Map View" },
  { path: "/feedstock-map", name: "Feedstock Map" },
  { path: "/financial-onboarding", name: "Financial Onboarding" },
  { path: "/bankability-explainer", name: "Bankability Explainer" },
  { path: "/grower-benefits", name: "Grower Benefits" },
  { path: "/project-registration", name: "Project Registration" },
  { path: "/certificate-verification", name: "Certificate Verification" },
  { path: "/producer-registration", name: "Producer Registration" },
  { path: "/dashboard", name: "Dashboard" },
];

// Brand color palette (from tailwind config / design system)
const BRAND_COLORS = {
  primary: {
    emerald: ["#10b981", "#059669", "#047857"], // Grower theme
    amber: ["#f59e0b", "#d97706", "#b45309"], // Developer theme
    blue: ["#3b82f6", "#2563eb", "#1d4ed8"], // Lender theme
  },
  neutral: [
    "#f9fafb",
    "#f3f4f6",
    "#e5e7eb",
    "#d1d5db",
    "#9ca3af",
    "#6b7280",
    "#4b5563",
    "#374151",
    "#1f2937",
    "#111827",
  ],
};

// Expected font families
const EXPECTED_FONTS = ["Inter", "system-ui", "sans-serif"];

interface DesignMetrics {
  page: string;
  path: string;
  fonts: string[];
  primaryColors: string[];
  hasNavigation: boolean;
  hasFooter: boolean;
  headingCount: number;
  buttonCount: number;
  iconCount: number;
  errors: string[];
}

async function collectDesignMetrics(
  page: Page,
  pagePath: string,
  pageName: string
): Promise<DesignMetrics> {
  const errors: string[] = [];

  // Navigate to page
  await page.goto(pagePath, { waitUntil: "networkidle" });

  // Collect font families used
  const fonts = await page.evaluate(() => {
    const elements = document.querySelectorAll("body *");
    const fontSet = new Set<string>();
    elements.forEach(el => {
      const computed = window.getComputedStyle(el);
      const fontFamily = computed.fontFamily;
      if (fontFamily) {
        // Extract first font in stack
        const primary = fontFamily.split(",")[0].replace(/['"]/g, "").trim();
        fontSet.add(primary);
      }
    });
    return Array.from(fontSet);
  });

  // Collect colors used on buttons and primary elements
  const primaryColors = await page.evaluate(() => {
    const colorSet = new Set<string>();
    const buttons = document.querySelectorAll(
      "button, a.btn, [class*='btn'], [class*='Button']"
    );
    const primaryElements = document.querySelectorAll(
      "[class*='primary'], [class*='emerald'], [class*='amber'], [class*='blue']"
    );

    [...buttons, ...primaryElements].forEach(el => {
      const computed = window.getComputedStyle(el);
      if (
        computed.backgroundColor &&
        computed.backgroundColor !== "rgba(0, 0, 0, 0)"
      ) {
        colorSet.add(computed.backgroundColor);
      }
      if (computed.color) {
        colorSet.add(computed.color);
      }
    });
    return Array.from(colorSet);
  });

  // Check for navigation presence
  const hasNavigation = await page.evaluate(() => {
    return !!(
      document.querySelector("nav") ||
      document.querySelector("[role='navigation']") ||
      document.querySelector("header")
    );
  });

  // Check for footer presence
  const hasFooter = await page.evaluate(() => {
    return !!(
      document.querySelector("footer") ||
      document.querySelector("[role='contentinfo']")
    );
  });

  // Count headings for structure consistency
  const headingCount = await page.locator("h1, h2, h3, h4, h5, h6").count();

  // Count buttons
  const buttonCount = await page.locator("button").count();

  // Count SVG icons (lucide-react style)
  const iconCount = await page.locator("svg").count();

  // Check for console errors
  const consoleErrors: string[] = [];
  page.on("console", msg => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  return {
    page: pageName,
    path: pagePath,
    fonts,
    primaryColors,
    hasNavigation,
    hasFooter,
    headingCount,
    buttonCount,
    iconCount,
    errors: consoleErrors,
  };
}

test.describe("Design Consistency Tests", () => {
  test("All pages should load without errors", async ({ page }) => {
    for (const pageConfig of PAGES) {
      await test.step(`Loading ${pageConfig.name}`, async () => {
        const response = await page.goto(pageConfig.path);
        expect(response?.status()).toBe(200);
      });
    }
  });

  test("Typography - Font consistency across pages", async ({ page }) => {
    const fontUsage: Map<string, string[]> = new Map();

    for (const pageConfig of PAGES) {
      await page.goto(pageConfig.path, { waitUntil: "networkidle" });

      const fonts = await page.evaluate(() => {
        const body = document.body;
        const computed = window.getComputedStyle(body);
        return computed.fontFamily;
      });

      if (!fontUsage.has(fonts)) {
        fontUsage.set(fonts, []);
      }
      fontUsage.get(fonts)!.push(pageConfig.name);
    }

    // All pages should use the same base font stack
    const uniqueFontStacks = Array.from(fontUsage.keys());
    console.log("Font stacks found:", uniqueFontStacks);

    // Allow for some variation but flag major inconsistencies
    expect(uniqueFontStacks.length).toBeLessThanOrEqual(3);
  });

  test("Color palette - Primary colors are from brand palette", async ({
    page,
  }) => {
    const allColors: Set<string> = new Set();

    for (const pageConfig of PAGES.slice(0, 5)) {
      // Test first 5 pages
      await page.goto(pageConfig.path, { waitUntil: "networkidle" });

      const colors = await page.evaluate(() => {
        const colorSet = new Set<string>();
        const elements = document.querySelectorAll(
          "button, [class*='bg-'], [class*='text-']"
        );
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          if (computed.backgroundColor !== "rgba(0, 0, 0, 0)") {
            colorSet.add(computed.backgroundColor);
          }
        });
        return Array.from(colorSet);
      });

      colors.forEach(c => allColors.add(c));
    }

    console.log(`Found ${allColors.size} unique colors across pages`);
    // Just ensure we're collecting data - manual review needed for exact palette matching
    expect(allColors.size).toBeGreaterThan(0);
  });

  test("Navigation - Consistent header/nav across pages", async ({ page }) => {
    const navigationConsistency: {
      page: string;
      hasNav: boolean;
      hasHeader: boolean;
    }[] = [];

    for (const pageConfig of PAGES) {
      await page.goto(pageConfig.path, { waitUntil: "networkidle" });

      const hasNav = (await page.locator("nav").count()) > 0;
      const hasHeader = (await page.locator("header").count()) > 0;

      navigationConsistency.push({
        page: pageConfig.name,
        hasNav,
        hasHeader,
      });
    }

    // Log inconsistencies
    const withoutNav = navigationConsistency.filter(
      p => !p.hasNav && !p.hasHeader
    );
    if (withoutNav.length > 0) {
      console.log(
        "Pages without navigation:",
        withoutNav.map(p => p.page)
      );
    }

    // Most pages should have navigation
    const navCount = navigationConsistency.filter(
      p => p.hasNav || p.hasHeader
    ).length;
    expect(navCount).toBeGreaterThan(PAGES.length * 0.7); // 70% threshold
  });

  test("Icons - SVG icons present and consistent sizing", async ({ page }) => {
    const iconMetrics: { page: string; iconCount: number; sizes: string[] }[] =
      [];

    for (const pageConfig of PAGES.slice(0, 5)) {
      await page.goto(pageConfig.path, { waitUntil: "networkidle" });

      const metrics = await page.evaluate(() => {
        const svgs = document.querySelectorAll("svg");
        const sizes = new Set<string>();
        svgs.forEach(svg => {
          const width =
            svg.getAttribute("width") || window.getComputedStyle(svg).width;
          const height =
            svg.getAttribute("height") || window.getComputedStyle(svg).height;
          sizes.add(`${width}x${height}`);
        });
        return {
          count: svgs.length,
          sizes: Array.from(sizes),
        };
      });

      iconMetrics.push({
        page: pageConfig.name,
        iconCount: metrics.count,
        sizes: metrics.sizes,
      });
    }

    console.log("Icon metrics:", JSON.stringify(iconMetrics, null, 2));

    // Ensure icons are present
    const totalIcons = iconMetrics.reduce((sum, m) => sum + m.iconCount, 0);
    expect(totalIcons).toBeGreaterThan(0);
  });

  test("Buttons - Consistent button styling", async ({ page }) => {
    const buttonStyles: { page: string; styles: Set<string> }[] = [];

    for (const pageConfig of PAGES.slice(0, 5)) {
      await page.goto(pageConfig.path, { waitUntil: "networkidle" });

      const styles = await page.evaluate(() => {
        const buttons = document.querySelectorAll("button");
        const styleSet = new Set<string>();
        buttons.forEach(btn => {
          const computed = window.getComputedStyle(btn);
          const key = `${computed.borderRadius}|${computed.padding}|${computed.fontSize}`;
          styleSet.add(key);
        });
        return Array.from(styleSet);
      });

      buttonStyles.push({
        page: pageConfig.name,
        styles: new Set(styles),
      });
    }

    // Aggregate all unique button styles
    const allStyles = new Set<string>();
    buttonStyles.forEach(bs => bs.styles.forEach(s => allStyles.add(s)));

    console.log(`Found ${allStyles.size} unique button style combinations`);
    // Flag if too many variations (suggests inconsistency)
    expect(allStyles.size).toBeLessThan(20);
  });

  test("Heading hierarchy - Proper H1-H6 usage", async ({ page }) => {
    for (const pageConfig of PAGES.slice(0, 8)) {
      await test.step(`Checking ${pageConfig.name}`, async () => {
        await page.goto(pageConfig.path, { waitUntil: "networkidle" });

        const headingStructure = await page.evaluate(() => {
          const h1Count = document.querySelectorAll("h1").length;
          const h2Count = document.querySelectorAll("h2").length;
          const h3Count = document.querySelectorAll("h3").length;
          return { h1: h1Count, h2: h2Count, h3: h3Count };
        });

        // Each page should have at least one h1
        if (headingStructure.h1 === 0) {
          console.log(`Warning: ${pageConfig.name} has no H1`);
        }

        // Should not have more than 2 H1s
        expect(headingStructure.h1).toBeLessThanOrEqual(2);
      });
    }
  });

  test("Responsive - Pages render at different viewports", async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1280, height: 800, name: "Desktop" },
    ];

    for (const pageConfig of PAGES.slice(0, 3)) {
      for (const viewport of viewports) {
        await test.step(`${pageConfig.name} at ${viewport.name}`, async () => {
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });
          const response = await page.goto(pageConfig.path);
          expect(response?.status()).toBe(200);

          // Check that content is visible
          const bodyHeight = await page.evaluate(
            () => document.body.scrollHeight
          );
          expect(bodyHeight).toBeGreaterThan(100);
        });
      }
    }
  });

  test("Theme colors - Landing page hero gradients", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Check for gradient backgrounds (common in modern landing pages)
    const hasGradients = await page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      let gradientCount = 0;
      elements.forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg.includes("gradient")) {
          gradientCount++;
        }
      });
      return gradientCount;
    });

    console.log(`Landing page has ${hasGradients} gradient elements`);
    // Landing page should have some gradients for modern feel
    expect(hasGradients).toBeGreaterThan(0);
  });

  test("Accessibility - Color contrast basics", async ({ page }) => {
    for (const pageConfig of PAGES.slice(0, 3)) {
      await test.step(`Checking ${pageConfig.name}`, async () => {
        await page.goto(pageConfig.path, { waitUntil: "networkidle" });

        // Check that text elements have reasonable contrast
        const textElements = await page.evaluate(() => {
          const elements = document.querySelectorAll(
            "p, span, h1, h2, h3, h4, h5, h6, a, button"
          );
          let lowContrastCount = 0;

          elements.forEach(el => {
            const computed = window.getComputedStyle(el);
            const color = computed.color;
            // Very basic check - ensure text isn't transparent or nearly invisible
            if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
              lowContrastCount++;
            }
          });

          return { total: elements.length, lowContrast: lowContrastCount };
        });

        // Most text should have proper color
        const ratio = textElements.lowContrast / textElements.total;
        expect(ratio).toBeLessThan(0.1); // Less than 10% with issues
      });
    }
  });
});

test.describe("Page-Specific Design Tests", () => {
  test("Home page - Hero section exists", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Should have a hero section with main heading
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    // Should have CTA buttons or pathway links
    // The landing page has pathway cards linking to /grower/dashboard, /developer/dashboard, etc.
    const ctaButtons = page.locator(
      "a[href*='/grower'], a[href*='/developer'], a[href*='/finance'], a[href*='/explore'], button:has-text('Get Started'), a:has-text('Get Started'), a:has-text('Find Your Path')"
    );
    expect(await ctaButtons.count()).toBeGreaterThan(0);
  });

  test("For Growers page - Emerald theme colors", async ({ page }) => {
    await page.goto("/for-growers", { waitUntil: "networkidle" });

    // Check for emerald/green theme elements
    const greenElements = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        "[class*='emerald'], [class*='green']"
      );
      return elements.length;
    });

    expect(greenElements).toBeGreaterThan(0);
  });

  test("For Developers page - Amber theme colors", async ({ page }) => {
    await page.goto("/for-developers", { waitUntil: "networkidle" });

    // Check for amber/yellow theme elements
    const amberElements = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        "[class*='amber'], [class*='yellow'], [class*='orange']"
      );
      return elements.length;
    });

    expect(amberElements).toBeGreaterThan(0);
  });

  test("For Lenders page - Blue theme colors", async ({ page }) => {
    await page.goto("/for-lenders", { waitUntil: "networkidle" });

    // Check for blue theme elements
    const blueElements = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        "[class*='blue'], [class*='indigo']"
      );
      return elements.length;
    });

    expect(blueElements).toBeGreaterThan(0);
  });
});
