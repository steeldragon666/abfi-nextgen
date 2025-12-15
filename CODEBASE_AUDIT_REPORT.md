# ABFI Platform Codebase Audit Report

**Date:** December 15, 2025  
**Auditor:** Claude Code

---

## Executive Summary

This audit identified **52 TypeScript errors**, **175 legacy Next.js files**, configuration inconsistencies, and several design issues. The codebase has migrated from Next.js to Vite/tRPC but legacy code remains. Design consistency testing shows good typography and color theme adherence, but the landing page lacks proper semantic structure.

---

## 1. TypeScript Errors (52 Total)

### Critical Errors (Require Immediate Fix)

| File                                    | Line        | Error                                     | Priority |
| --------------------------------------- | ----------- | ----------------------------------------- | -------- |
| `client/src/components/ui/input.tsx`    | 1           | Missing `useDialogComposition` export     | HIGH     |
| `client/src/components/ui/textarea.tsx` | 1           | Missing `useDialogComposition` export     | HIGH     |
| `client/src/pages/AdminDashboard.tsx`   | 124,132,140 | `StatsCard` variant prop type mismatch    | HIGH     |
| `client/src/pages/Dashboard.tsx`        | 269         | `StatsCard` variant prop type mismatch    | HIGH     |
| `client/src/pages/FeedstockMap.tsx`     | 190         | GeoJSON type conversion error             | MEDIUM   |
| `client/src/pages/FuturesCreate.tsx`    | 120-130     | Accessing props without `.futures` prefix | HIGH     |

### Root Cause Analysis

1. **useDialogComposition**: The function is defined in `dialog.tsx` (line 19) but NOT included in the export list at line 197-208.

2. **StatsCard variant**: The component accepts `variant?: "default" | "success" | "warning" | "info" | "premium"` but TypeScript inference may be failing. The type definition at line 124-135 appears correct.

3. **FuturesCreate**: Code accesses `existingData.cropType` when it should be `existingData.futures.cropType`.

### Legacy Next.js Errors (~46 errors)

All files in `src/` reference Next.js modules that don't exist:

- `Cannot find module 'next/server'`
- `Cannot find module 'next/link'`
- `Cannot find module 'next/navigation'`

**Recommendation:** Delete entire `src/` directory (175 files, ~2,400 lines).

---

## 2. ESLint Configuration Issues

### Problem

ESLint config (`eslint.config.mjs`) references Next.js ESLint packages but:

- Project uses Vite, not Next.js
- ESLint is not in `package.json` dependencies
- Config imports non-existent `eslint-config-next`

### Fix Required

```javascript
// Replace eslint.config.mjs with Vite-compatible config:
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { files: ["**/*.{ts,tsx}"] },
  { ignores: ["dist/**", "node_modules/**", "src/**"] },
  // ... Vite-specific rules
];
```

---

## 3. Environment Configuration Issues

### .env File Analysis

| File           | Issue                                                   | Severity |
| -------------- | ------------------------------------------------------- | -------- |
| `.env`         | Contains actual API keys (should only be in .env.local) | HIGH     |
| `.env`         | SUPABASE_SERVICE_ROLE_KEY exposed                       | CRITICAL |
| `.env.local`   | Missing Google Maps API key                             | MEDIUM   |
| `.env.example` | Incomplete - missing Mapbox, service role example       | LOW      |
| All files      | Using `NEXT_PUBLIC_` prefix instead of `VITE_`          | LOW      |

### Current State

```
.env (SHOULD NOT HAVE REAL VALUES):
  NEXT_PUBLIC_SUPABASE_URL=https://rwfnjrckbbekusbkvbiz.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
  SUPABASE_SERVICE_ROLE_KEY=sb_secret_...  # CRITICAL - Should not be here!

.env.local (CORRECT LOCATION FOR SECRETS):
  Contains Supabase + Mapbox keys

.env.example (TEMPLATE - Missing entries):
  Missing: NEXT_PUBLIC_MAPBOX_TOKEN
  Missing: SUPABASE_SERVICE_ROLE_KEY placeholder
```

### Recommendations

1. Remove all real values from `.env`
2. Update `.env.example` with all required variables
3. Migrate `NEXT_PUBLIC_` prefixes to `VITE_` for Vite compatibility
4. Regenerate exposed API keys

---

## 4. Legacy/Dead Code

### Summary

- **175 files** in `src/` directory (legacy Next.js)
- **~2,400 lines** of unused code
- Importing non-existent Next.js modules

### Legacy Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register pages
│   ├── (dashboard)/     # Admin, buyer, supplier dashboards
│   ├── api/             # API routes (REST, not tRPC)
│   └── layout.tsx       # Next.js layouts
├── components/
│   ├── feedstock/
│   ├── inquiry/
│   └── shared/
├── icons/               # Custom SVG icons
└── lib/
    └── supabase/        # Supabase client (legacy)
```

### Recommendation

Delete `src/` directory entirely after confirming no unique code needs migration.

---

## 5. Package Dependencies

### Outdated Packages

| Package        | Current | Latest  | Risk                   |
| -------------- | ------- | ------- | ---------------------- |
| lucide-react   | 0.453.0 | 0.561.0 | LOW                    |
| express        | 4.22.1  | 5.2.1   | MEDIUM (major version) |
| @types/express | 4.17.21 | 5.0.6   | MEDIUM                 |
| drizzle-orm    | 0.44.7  | 0.45.1  | LOW                    |
| recharts       | 2.15.4  | 3.5.1   | HIGH (major version)   |
| superjson      | 1.13.3  | 2.2.6   | MEDIUM (major version) |
| vitest         | 2.1.9   | 4.0.15  | HIGH (major version)   |

### Conflicting Dependencies

1. **@builder.io/vite-plugin-jsx-loc**: Requires vite ^4.0.0 || ^5.0.0 but project has vite 7.x
2. **pnpm patches**: References `wouter@3.7.1` but installed is `wouter@3.3.5`

### Missing Dependencies

- ESLint (referenced in config but not installed)
- @playwright/test (now installed)

---

## 6. Design Consistency Audit (Playwright)

### Test Results: 12 Passed, 2 Failed

#### Passed Tests

- Typography - Font consistency (Inter across all pages)
- Color palette - 34 unique colors detected
- Navigation consistency - 70%+ pages have nav
- Icons - Present with consistent 24x24 sizing
- Buttons - Only 6 style variations (good)
- Responsive - All viewports render correctly
- Theme colors - Emerald/Amber/Blue correctly applied

#### Failed Tests

| Test              | Issue                | Fix Required                         |
| ----------------- | -------------------- | ------------------------------------ |
| Home page H1      | No `<h1>` tag found  | Add semantic heading                 |
| Gradient elements | 0 gradients detected | CSS gradient not in background-image |

### Design Issues Identified

1. **Missing H1 on Landing Page**
   - Accessibility violation (WCAG 2.1)
   - SEO impact
2. **Missing Navigation on Key Pages**
   - Home/Landing
   - Futures Marketplace
   - Feedstock Map
   - Dashboard

3. **Icon Size Inconsistency**
   - Most icons: 24x24
   - Landing page: only 2 icons (48x48, 16x16)
   - Large SVG backgrounds: 1280px width

4. **Gradients**
   - Landing page has inline gradient styles via Tailwind classes
   - Not detected by `backgroundImage` CSS property check
   - Tailwind uses `bg-gradient-*` classes which compile differently

---

## 7. Recommended Actions

### Immediate (This Week)

1. **Fix TypeScript Errors**
   - Add `useDialogComposition` to dialog.tsx exports
   - Fix StatsCard variant type inference
   - Fix FuturesCreate property access

2. **Security**
   - Remove secrets from `.env`
   - Regenerate exposed Supabase service role key
   - Update `.env.example`

3. **Accessibility**
   - Add H1 to landing page
   - Add navigation to missing pages

### Short-term (Next Sprint)

4. **Delete Legacy Code**
   - Remove `src/` directory (175 files)
   - Update ESLint config for Vite

5. **Fix Dependencies**
   - Remove @builder.io/vite-plugin-jsx-loc or downgrade vite
   - Update pnpm patches reference
   - Install ESLint properly

### Long-term (Backlog)

6. **Dependency Updates**
   - Plan migration to Express 5.x
   - Plan migration to Recharts 3.x
   - Evaluate superjson 2.x compatibility

---

## 8. Files Modified During Audit

1. `playwright.config.ts` - Updated baseURL to port 3001
2. `tests/design-consistency.spec.ts` - Created new test file
3. `package.json` - Added @playwright/test dependency

---

## Appendix A: Full TypeScript Error Output

```
client/src/components/ui/input.tsx(1,10): error TS2305: Module '"@/components/ui/dialog"' has no exported member 'useDialogComposition'.
client/src/components/ui/textarea.tsx(1,10): error TS2305: Module '"@/components/ui/dialog"' has no exported member 'useDialogComposition'.
client/src/pages/AdminDashboard.tsx(124,13): error TS2322: Property 'variant' does not exist on type...
client/src/pages/AdminDashboard.tsx(132,13): error TS2322: Property 'variant' does not exist on type...
client/src/pages/AdminDashboard.tsx(140,13): error TS2322: Property 'variant' does not exist on type...
client/src/pages/Dashboard.tsx(269,19): error TS2322: Property 'variant' does not exist on type...
client/src/pages/FeedstockMap.tsx(190,26): error TS2352: Conversion of type 'number[]...' may be a mistake
client/src/pages/FuturesCreate.tsx(120,35): error TS2339: Property 'cropType' does not exist
client/src/pages/FuturesCreate.tsx(121,38): error TS2339: Property 'cropVariety' does not exist
client/src/pages/FuturesCreate.tsx(122,32): error TS2339: Property 'title' does not exist
... (46 more legacy Next.js errors in src/ directory)
```

---

## Appendix B: Playwright Test Output

```
Running 14 tests using 10 workers

Font stacks found: [ 'Inter, system-ui, -apple-system, sans-serif' ]
Found 34 unique colors across pages
Found 6 unique button style combinations
Pages without navigation: [ 'Home/Landing', 'Futures Marketplace', 'Feedstock Map', 'Dashboard' ]
Warning: Home/Landing has no H1
Warning: Futures Marketplace has no H1
Landing page has 0 gradient elements

12 passed
2 failed
```
