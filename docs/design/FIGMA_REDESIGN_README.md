# ABFI Platform — Figma Design System README

## Overview

**Figma File:** `ABFI Platform — DS & Product UI (Grower-First) v3.0`

This design system is built with a **Grower-First** philosophy while maintaining enterprise-grade quality for developers and financiers.

---

## Design Goals

| Goal | Description |
|------|-------------|
| **Primary User** | Growers / Producers (non-technical, time-poor) |
| **Secondary** | Developers, Financiers |
| **Tone** | Calm, trustworthy, professional |
| **Avoid** | Terminal density, trading metaphors, cognitive overload |

### Non-Negotiables

1. Clear "what do I do next?" on every screen
2. Minimal jargon; explainers always available
3. One primary CTA per screen
4. Evidence and scoring explained, not just shown

---

## Figma File Structure

```
ABFI Platform — DS & Product UI (Grower-First) v3.0
├── 00_Cover
├── 01_Tokens
├── 02_Foundations
├── 03_Components — UI Kit
├── 04_Components — ABFI Domain
├── 05_Patterns
├── 06_Templates
├── 07_Screens — Core App
├── 08_Screens — Marketing & Authority
├── 09_States & Empty
├── 10_Prototypes
└── 99_Archive
```

---

## Component Mapping: Figma → Code

### A) Layout + Shell Components

| Figma Component | Code File | Notes |
|-----------------|-----------|-------|
| Layout/AppShell | `components/AppLayout.tsx` | Canonical wrapper for authenticated app screens |
| Layout/DashboardShell | `components/DashboardLayout.tsx` | Use for all role dashboards + analytics pages |
| Layout/DashboardShellSkeleton | `components/DashboardLayoutSkeleton.tsx` | Design explicit skeleton states in Figma |
| Layout/PageContainer | `components/layout/PageContainer.tsx` | Standard padding/max width; must be consistent |
| Layout/PageHeader | `components/layout/PageHeader.tsx` | Title + actions + breadcrumbs |
| Layout/PageLayout | `components/layout/PageLayout.tsx` | Compose header + container + sections |
| Layout/SectionHeader | `components/layout/SectionHeader.tsx` | Section titles inside long pages |
| Layout/StatsGrid | `components/layout/StatsGrid.tsx` | KPI tile grid pattern |
| Layout/PageFooter | `components/layout/PageFooter.tsx` | Consistent footer for marketing / legal |

### B) ABFI Domain Components

| Figma Component | Code File | Notes |
|-----------------|-----------|-------|
| RoleHeader | `components/RoleHeader.tsx` | Make this the "persona anchor"; include KPIs + primary CTA |
| ScoreCard | `components/ScoreCard.tsx` | Standardize score visuals; remove ad-hoc badge usage |
| Score/Badge, Ring, Pillars | `components/ScoreComponents.tsx` | Convert into: ScoreBadge, ConfidenceChip, PillarBars |
| ExplainerCarousel | `components/ExplainerCarousel.tsx` | Marketing + onboarding; consistent layout |
| Maps/BiomassMap | `components/maps/BiomassMap.tsx` | Define map container patterns + legend + filters |
| AIChatBox | `components/AIChatBox.tsx` | Make it a "utility drawer/panel", not competing UI |
| LegalDisclaimer | `components/LegalDisclaimer.tsx` | Standard "trust footer panel" style |

### C) System State Components

| Figma Component | Code File | Notes |
|-----------------|-----------|-------|
| Error State | `components/ErrorBoundary.tsx` | Replace generic "Sorry" with actionable, coded errors |
| Empty State | `components/ui/empty.tsx` | Standardize all "no data" screens |
| Skeleton | `components/ui/skeleton.tsx` | Ensure consistent skeleton density across dashboards |
| Toast | `components/ui/sonner.tsx` | Toast spec goes into Figma |
| Drawer/Sheet | `components/ui/drawer.tsx`, `sheet.tsx` | Evidence drawers, entity inspectors |
| Dialog | `components/ui/dialog.tsx` | Confirmations / exports |

---

## UI Kit Mapping (components/ui/)

### Actions
| Component | File |
|-----------|------|
| Button | `ui/button.tsx` |
| ButtonGroup | `ui/button-group.tsx` |
| Toggle | `ui/toggle.tsx` |
| ToggleGroup | `ui/toggle-group.tsx` |

### Inputs
| Component | File |
|-----------|------|
| Input | `ui/input.tsx` |
| Textarea | `ui/textarea.tsx` |
| Select | `ui/select.tsx` |
| Checkbox | `ui/checkbox.tsx` |
| RadioGroup | `ui/radio-group.tsx` |
| Slider | `ui/slider.tsx` |
| Switch | `ui/switch.tsx` |
| Calendar | `ui/calendar.tsx` |
| Form | `ui/form.tsx` |
| Field | `ui/field.tsx` |
| InputGroup | `ui/input-group.tsx` |

### Navigation
| Component | File |
|-----------|------|
| Sidebar | `ui/sidebar.tsx` |
| Breadcrumb | `ui/breadcrumb.tsx` |
| NavigationMenu | `ui/navigation-menu.tsx` |
| Menubar | `ui/menubar.tsx` |
| Pagination | `ui/pagination.tsx` |
| Tabs | `ui/tabs.tsx` |

### Surfaces
| Component | File |
|-----------|------|
| Card | `ui/card.tsx` |
| Separator | `ui/separator.tsx` |
| ScrollArea | `ui/scroll-area.tsx` |
| Resizable | `ui/resizable.tsx` |
| Collapsible | `ui/collapsible.tsx` |

### Overlays
| Component | File |
|-----------|------|
| Dialog | `ui/dialog.tsx` |
| Drawer | `ui/drawer.tsx` |
| Sheet | `ui/sheet.tsx` |
| Popover | `ui/popover.tsx` |
| HoverCard | `ui/hover-card.tsx` |
| Tooltip | `ui/tooltip.tsx` |
| ContextMenu | `ui/context-menu.tsx` |
| DropdownMenu | `ui/dropdown-menu.tsx` |

### Feedback
| Component | File |
|-----------|------|
| Alert | `ui/alert.tsx` |
| Toast (Sonner) | `ui/sonner.tsx` |
| Spinner | `ui/spinner.tsx` |
| Skeleton | `ui/skeleton.tsx` |
| Empty | `ui/empty.tsx` |
| Progress | `ui/progress.tsx` |

---

## Page Mapping: Figma Screens → Code Files

### Dashboards
| Screen | File |
|--------|------|
| Dashboard (generic) | `pages/Dashboard.tsx` |
| Developer Dashboard | `pages/DeveloperDashboard.tsx` |
| Grower Dashboard | `pages/GrowerDashboard.tsx` |
| Finance Dashboard | `pages/FinanceDashboard.tsx` |
| Admin Dashboard | `pages/AdminDashboard.tsx` |

### Marketplace & Feedstock
| Screen | File |
|--------|------|
| Explore | `pages/Explore.tsx` |
| Browse | `pages/Browse.tsx` |
| Feedstock Detail | `pages/FeedstockDetail.tsx` |
| Feedstock Map | `pages/FeedstockMap.tsx` |
| Feedstock Create | `pages/FeedstockCreate.tsx` |
| Feedstock Edit | `pages/FeedstockEdit.tsx` |

### Bankability
| Screen | File |
|--------|------|
| Bankability Dashboard | `pages/BankabilityDashboard.tsx` |
| Bankability Assessment | `pages/BankabilityAssessment.tsx` |
| Bankability Ratings | `pages/BankabilityRatings.tsx` |
| Bankability Explainer | `pages/BankabilityExplainer.tsx` |
| Project Ratings Matrix | `pages/ProjectRatingsMatrix.tsx` |
| Project Rating Detail | `pages/ProjectRatingDetail.tsx` |
| Carbon Intensity Analysis | `pages/CarbonIntensityAnalysis.tsx` |

### Marketing & Authority
| Screen | File |
|--------|------|
| Home | `pages/Home.tsx` |
| Landing | `pages/Landing.tsx` |
| For Developers | `pages/ForDevelopers.tsx` |
| For Growers | `pages/ForGrowers.tsx` |
| For Lenders | `pages/ForLenders.tsx` |
| Platform Features | `pages/PlatformFeatures.tsx` |
| Grower Benefits | `pages/GrowerBenefits.tsx` |

---

## Design Tokens

### Color Philosophy
- **Neutrals** do the heavy lifting
- **Green** = success only (never decoration)
- **Amber** = attention / needs input
- **Red** = risk / blocking issue
- **Primary accent:** calm green (not neon)
- **Secondary accent:** muted blue (links, info)

### Typography Rules (Grower-Friendly)
- Large headings (H1/H2) → reduce intimidation
- Body copy slightly larger than default SaaS norms
- Avoid dense tables without spacing

### Motion Rules
- Subtle hover feedback only
- No fast transitions
- No animated numbers (finance teams like it; growers don't)

---

## Grower-First Design Rules

| Rule | Description |
|------|-------------|
| **One CTA** | One primary action per screen |
| **Plain English** | Plain-English before metrics |
| **Max 3 metrics** | No more than 3 metrics visible at once |
| **Collapsed filters** | Filters collapsed by default |
| **Cards over tables** | Use cards first, not full-width data tables |
| **Large text** | Body text slightly larger than typical SaaS |
| **Explainers available** | Explainers always available on complex screens |

---

## Pattern Library

### Pattern 1: "What do I need to do?"
Used on: Grower Dashboard, Registration steps, Compliance screens

```
[Progress indicator]
[Main instruction]
[Primary action]
[Secondary help]
```

### Pattern 2: Registration & Qualification
Used on: ProducerRegistration, GrowerQualification, CertificateUpload

Rules:
- One question per section
- Clear completion indicator
- No long scroll forms

### Pattern 3: Score Explanation
Used on: Bankability screens, Ratings views

```
Score → Plain-English meaning → What improves it
```

### Pattern 4: Data Table
Used on: Browse, Admin, Audit logs

```
[Header row: title + filters + actions]
[Table body]
[Pagination]
[Empty state variant]
[Skeleton state variant]
```

---

## Templates

| Template | Used By |
|----------|---------|
| T-Dashboard (Grower) | GrowerDashboard |
| T-Dashboard (Developer) | DeveloperDashboard |
| T-Dashboard (Finance) | FinanceDashboard |
| T-Dashboard (Admin) | AdminDashboard |
| T-Registration Flow | ProducerRegistration*, Qualification* |
| T-Detail View | FeedstockDetail, SupplierProfile |
| T-Compliance | CertificateVerification, AuditLogs |
| T-Marketplace | Browse, FuturesMarketplace |

---

## Prototypes (3 Only)

### 1. Grower Onboarding → First Listing
- Registration flow
- Profile completion
- First feedstock listing

### 2. Grower Improving Score → Re-submission
- Score review
- Improvement guidance
- Evidence upload

### 3. Grower Responding to Inquiry
- Inquiry notification
- Response form
- Confirmation

**Each prototype must:**
- Show reassurance
- Avoid data overload
- Always end with "What happens next?"

---

## Score System Consolidation

### Current State
- `ScoreCard.tsx` - Main score display
- `ScoreComponents.tsx` - Various score widgets

### Target Figma-to-Code Contract

| Figma Component | Purpose |
|-----------------|---------|
| ScoreBadge | Text band (Excellent / Good / Needs work) |
| ConfidenceChip | Confidence level (High / Medium / Low) |
| PillarCard | Individual pillar with icon + explanation |
| ScoreCard | Composite using above components |

This reduces "random badge soup" across pages.

---

## Entity Header Pattern

Many pages build their own headers. Create standard:

**EntityHeader** pattern using:
- `layout/PageHeader.tsx`
- `ui/breadcrumb.tsx`
- `ui/button.tsx`
- `ui/badge.tsx`

Used by: FeedstockDetail, DemandSignalDetail, FuturesDetail*, SupplierProfile

---

## Implementation Notes

### Why Option A Works for Growers
- Familiar layout patterns
- Fewer numbers, more explanation
- Clear progression & reassurance
- No "finance terminal" intimidation

### Later Upgrade Path
- Developers/lenders can be given denser variants of the same components
- Same system, different presets

### Architecture Benefits
Your current architecture is already "Figma-friendly":
- Solid UI kit (`components/ui/*`)
- Layout primitives (`components/layout/*`)
- Domain widgets (ScoreCard, maps, explainers)
- Many pages that repeat patterns

**The Figma job is:**
1. Lock down components + patterns
2. Convert key pages into canonical screen designs
3. Pages inherit templates, not bespoke styling

---

## Files Reference

### Component Directories
```
client/src/components/
├── ui/                    # 55 shadcn-style components
├── layout/                # 7 layout primitives
├── maps/                  # 2 map components
└── *.tsx                  # 15 domain components
```

### Page Directory
```
client/src/pages/          # 92 page files
```

---

## Getting Started

1. Open `FIGMA_REDESIGN_TODO.md` for the full checklist
2. Start with PAGE 00 (Cover) to establish context
3. Complete PAGE 01 (Tokens) before any component work
4. Build components in PAGE 03-04 before screens
5. Use patterns (PAGE 05) to compose screens
6. Build priority screens first (Grower journey)

---

## Questions?

- **Repo:** https://github.com/steeldragon666/abfi-platform-1
- **Staging:** https://abfi-platform.vercel.app
