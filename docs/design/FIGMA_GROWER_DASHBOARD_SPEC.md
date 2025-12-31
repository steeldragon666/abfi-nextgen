# Grower Dashboard — Full Fidelity Layout Spec

**Screen ID:** `Screen / GrowerDashboard / v1`
**Code File:** `client/src/pages/GrowerDashboard.tsx`
**Uses Layouts:** `DashboardLayout.tsx` + `RoleHeader.tsx` + `layout/*` + `ui/*`

---

## Frame Dimensions

| Breakpoint | Width | Notes |
|------------|-------|-------|
| Desktop | 1440px | Auto height |
| Tablet | 768px | 8-col grid |
| Mobile | 390px | 4-col grid |

---

## A) App Shell (Outer Frame)

### Structure
```
┌─────────────────────────────────────────────────────────┐
│ Topbar (with Search)                                    │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │  Page Container (max-width: 1200-1280px)    │
│ (expanded)│                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Sidebar
- **State:** Expanded (always for growers)
- **Labels:** Always visible (no icon-only mode)

### Topbar
- Search input
- User avatar dropdown
- Notifications icon

### Page Container
- Max width: 1200–1280px
- Centered with auto margins
- Padding: 24px (desktop), 16px (mobile)

---

## B) Section 1: RoleHeader Block (Top of Content)

**Component:** `Domain/RoleHeader`

### Content Requirements

| Element | Content | Notes |
|---------|---------|-------|
| Title | "Grower Dashboard" | |
| Status Chip | Dynamic based on state | See variants below |
| Progress | "Complete 2 more steps to become visible to buyers." | |
| Primary CTA | Dynamic based on completion | |
| Secondary Action | "How scoring works" | Link style, not button |

### Status Chip Variants

| State | Label | Tone |
|-------|-------|------|
| Incomplete | "Profile incomplete" | `warning` |
| Ready | "Ready to receive inquiries" | `success` |
| Action Required | "Action required" | `risk` |

### Primary CTA Variants

| State | Label |
|-------|-------|
| Incomplete | "Continue setup" |
| Complete | "Create a listing" |

### Layout Spec
```
┌─────────────────────────────────────────────────────────┐
│ Grower Dashboard                              [Help ↗]  │
│                                                         │
│ ┌─────────────────┐  Complete 2 more steps to become   │
│ │ Ready to receive│  visible to buyers.                │
│ │ inquiries ✓     │                                    │
│ └─────────────────┘  ▓▓▓▓▓▓▓▓▓▓░░░░░ 65%              │
│                                                         │
│                      [Continue setup]  How scoring works│
└─────────────────────────────────────────────────────────┘
```

---

## C) Section 2: Next Step Card (Dominant)

**Position:** Immediately below RoleHeader
**Component:** `UI/Card` (elevated style)

### Layout
Two-column card layout:
- **Left:** Main instruction
- **Right:** Small checklist (max 3 items)

### Content Spec

| Element | Content |
|---------|---------|
| Title | "Your next best step" |
| Body | "Add your property details to improve visibility and confidence." |
| Primary CTA | "Add property details" |
| Microcopy | "Takes ~3 minutes" |

### Checklist (Right Side)
| Item | Status | Maps to Page |
|------|--------|--------------|
| Property boundary | ✅/⏳ | `ProducerPropertyDetails.tsx` |
| Certificates | ✅/⏳ | `CertificateUpload.tsx` |
| Production profile | ✅/⏳ | `ProducerProductionProfile.tsx` |

### Layout Spec
```
┌─────────────────────────────────────────────────────────┐
│ ⭐ Your next best step                                  │
├────────────────────────────────┬────────────────────────┤
│                                │ Progress               │
│ Add your property details to   │ ✅ Property boundary   │
│ improve visibility and         │ ⏳ Certificates        │
│ confidence.                    │ ⏳ Production profile  │
│                                │                        │
│ [Add property details]         │                        │
│ Takes ~3 minutes               │                        │
└────────────────────────────────┴────────────────────────┘
```

---

## D) Section 3: KPI Tiles (Max 3)

**Component:** `Pattern/StatsGrid` with 3 tiles
**Density:** Comfortable (not compact)

### Tile 1: Visibility
| Element | Value |
|---------|-------|
| Label | "Visibility" |
| Value | "Limited" / "Standard" / "High" |
| Helper | "How often buyers can find you" |
| Delta | "↑ improving" (optional) |

### Tile 2: Confidence
| Element | Value |
|---------|-------|
| Label | "Confidence" |
| Value | "Medium" |
| Helper | "Based on evidence completeness" |
| Action | "Add evidence" (link) |

### Tile 3: Inquiries
| Element | Value |
|---------|-------|
| Label | "Inquiries" |
| Value | "2 open" |
| Helper | "Buyer requests awaiting response" |
| Action | "View inquiries" (link) |

### Layout Spec
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Visibility      │ Confidence      │ Inquiries       │
│                 │                 │                 │
│ Standard        │ Medium          │ 2 open          │
│ ↑ improving     │                 │                 │
│                 │                 │                 │
│ How often       │ Based on        │ Buyer requests  │
│ buyers can      │ evidence        │ awaiting        │
│ find you        │ completeness    │ response        │
│                 │                 │                 │
│                 │ [Add evidence]  │ [View inquiries]│
└─────────────────┴─────────────────┴─────────────────┘
```

---

## E) Section 4: Your Listings (Cards, Not Table)

**Rule:** Growers see cards first, tables later

### Section Header
- **Title:** "Your listings"
- **Right Action:** "Create listing" (secondary button)

### Listing Card Component

**Grid:** 2 columns (desktop), 1 column (mobile)

Each card shows:
| Element | Description |
|---------|-------------|
| Listing name | Title |
| Status pill | Draft / Pending verification / Live |
| ScoreBadge | Band + label |
| Feedstock type | Key attribute |
| Available volume | Key attribute |
| Actions | Edit (primary), View (secondary) |

### Layout Spec
```
┌─────────────────────────────────────────────────────────┐
│ Your listings                          [Create listing] │
├───────────────────────────┬─────────────────────────────┤
│ ┌───────────────────────┐ │ ┌───────────────────────┐   │
│ │ Wheat Stubble 2024    │ │ │ Canola Straw Bulk     │   │
│ │ ┌────┐ ┌──────┐       │ │ │ ┌────────┐ ┌──────┐   │   │
│ │ │Live│ │Good  │       │ │ │ │Pending │ │Medium│   │   │
│ │ └────┘ └──────┘       │ │ │ └────────┘ └──────┘   │   │
│ │                       │ │ │                       │   │
│ │ Wheat stubble         │ │ │ Canola straw          │   │
│ │ 500t / Mar-May 2024   │ │ │ 200t / Jun-Aug 2024   │   │
│ │                       │ │ │                       │   │
│ │ [Edit]  View          │ │ │ [Edit]  View          │   │
│ └───────────────────────┘ │ └───────────────────────┘   │
└───────────────────────────┴─────────────────────────────┘
```

### Maps to Pages
- `ProducerMarketplaceListing.tsx`
- `FeedstockCreate.tsx`
- `FeedstockEdit.tsx`
- `FeedstockDetail.tsx`

---

## F) Section 5: Evidence & Certificates

**Purpose:** Critical for grower trust — make it feel achievable

### Component
`UI/Card` (outlined) + Progress bar

### Content Spec
| Element | Value |
|---------|-------|
| Title | "Evidence & Certificates" |
| Progress | "2 of 5 recommended items added" |
| Progress bar | Visual indicator |

### Checklist (Max 5)
| Item | Status |
|------|--------|
| Sustainability certificate | ✅/⏳ |
| Quality test result | ✅/⏳ |
| Proof of production capacity | ✅/⏳ |
| Location boundary | ✅/⏳ |
| Insurance / compliance | ✅/⏳ (optional) |

### CTA
"Upload certificate"

### Layout Spec
```
┌─────────────────────────────────────────────────────────┐
│ 📄 Evidence & Certificates                              │
│                                                         │
│ 2 of 5 recommended items added                          │
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░ 40%                          │
│                                                         │
│ ✅ Sustainability certificate                           │
│ ✅ Quality test result                                  │
│ ⏳ Proof of production capacity                         │
│ ⏳ Location boundary                                    │
│ ○  Insurance / compliance (optional)                    │
│                                                         │
│ [Upload certificate]                                    │
└─────────────────────────────────────────────────────────┘
```

### Maps to Pages
- `CertificateUpload.tsx`
- `QualityTestUpload.tsx`
- `EvidenceManagement.tsx`
- `EvidenceVaultDashboard.tsx`

---

## G) Section 6: Map (Optional, Simple)

**Include only if clean and not heavy**

### Component
`Domain/BiomassMapContainer` card

### Settings
| Property | Value |
|----------|-------|
| Filters | Collapsed by default |
| CTA overlay | "Add your property" |

### Layout Spec
```
┌─────────────────────────────────────────────────────────┐
│ 🗺️ Your Property                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │              [Map visualization]                    │ │
│ │                                                     │ │
│ │         ┌─────────────────────┐                     │ │
│ │         │ Add your property ↗ │                     │ │
│ │         └─────────────────────┘                     │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ [Show filters ▼]                                        │
└─────────────────────────────────────────────────────────┘
```

### Maps to Pages
- `ProducerPropertyMap.tsx`
- `FeedstockMap.tsx`

---

## H) Section 7: Help & Explainers

**Component:** `Domain/ExplainerCarousel`
**Variant:** `onboarding`
**Panels:** 3

### Panel Content
| # | Title | Content |
|---|-------|---------|
| 1 | "How buyers find you" | Explanation of visibility |
| 2 | "What improves your score" | Score factors |
| 3 | "What verification means" | Trust building |

### Layout Spec
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │ How buyers      │ │ What improves   │ │ What        │ │
│ │ find you        │ │ your score      │ │ verification│ │
│ │                 │ │                 │ │ means       │ │
│ │ Buyers search...│ │ Your score is...│ │ Verified... │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
│                       ● ○ ○                             │
└─────────────────────────────────────────────────────────┘
```

---

## I) Responsive Rules (Critical for Growers on Mobile)

### Mobile (390px)
| Element | Behavior |
|---------|----------|
| Sidebar | Collapses into hamburger drawer |
| KPI tiles | 1 column stack |
| Listing cards | 1 column |
| Next Step card | Full width, stacked layout |
| Map | Full width, collapsible |

### Tablet (768px)
| Element | Behavior |
|---------|----------|
| Sidebar | Collapsed by default, expandable |
| KPI tiles | 3 columns |
| Listing cards | 2 columns |

### Desktop (1440px)
| Element | Behavior |
|---------|----------|
| Sidebar | Expanded |
| KPI tiles | 3 columns |
| Listing cards | 2 columns |
| Max content width | 1200-1280px |

---

## Build Order in Figma (Fastest Path)

1. [ ] AppShell layout frame
2. [ ] RoleHeader hero block
3. [ ] Next Step card
4. [ ] StatsGrid tiles (3)
5. [ ] Listing cards grid
6. [ ] Evidence card + progress
7. [ ] ExplainerCarousel (3 panels)
8. [ ] States (empty / no listings / loading)

---

## States to Design

### Empty State: No Listings
```
┌─────────────────────────────────────────────────────────┐
│ Your listings                          [Create listing] │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │     📦                                              │ │
│ │     No listings yet                                 │ │
│ │                                                     │ │
│ │     Create your first listing to start              │ │
│ │     receiving buyer inquiries.                      │ │
│ │                                                     │ │
│ │     [Create your first listing]                     │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Loading State
- Skeleton for RoleHeader
- Skeleton for StatsGrid (3 tiles)
- Skeleton for listing cards

### Profile Incomplete State
- Warning banner at top
- "Continue setup" as dominant CTA
- Progress indicator prominent

---

## Full Page Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│ TOPBAR: Search │ Notifications │ Avatar                             │
├──────────┬──────────────────────────────────────────────────────────┤
│          │                                                          │
│ SIDEBAR  │  ┌─────────────────────────────────────────────────────┐ │
│          │  │ A) ROLE HEADER                                      │ │
│ • Home   │  │ Grower Dashboard         [Help ↗]                   │ │
│ • Explore│  │ ┌──────────────┐                                    │ │
│          │  │ │Ready ✓      │  Progress: 65%                      │ │
│ DASHBOARDS│ │ └──────────────┘  [Continue setup]                  │ │
│ • Grower │  └─────────────────────────────────────────────────────┘ │
│ • Dev    │                                                          │
│ • Finance│  ┌─────────────────────────────────────────────────────┐ │
│          │  │ B) NEXT STEP CARD                                   │ │
│ MARKET   │  │ Your next best step              ✅ Property        │ │
│ • Browse │  │ Add property details...          ⏳ Certificates    │ │
│ • Futures│  │ [Add property details]           ⏳ Profile         │ │
│          │  └─────────────────────────────────────────────────────┘ │
│ INTEL    │                                                          │
│ • Ratings│  ┌─────────────┬─────────────┬─────────────┐            │
│ • Stealth│  │ C) KPI 1    │ C) KPI 2    │ C) KPI 3    │            │
│          │  │ Visibility  │ Confidence  │ Inquiries   │            │
│ PLATFORM │  │ Standard    │ Medium      │ 2 open      │            │
│ • Evidence│ └─────────────┴─────────────┴─────────────┘            │
│ • Supply │                                                          │
│          │  ┌─────────────────────────────────────────────────────┐ │
│ [Sign In]│  │ D) YOUR LISTINGS              [Create listing]      │ │
│          │  │ ┌───────────────┐ ┌───────────────┐                 │ │
│          │  │ │ Listing 1     │ │ Listing 2     │                 │ │
│          │  │ │ Live │ Good   │ │ Pending │ Med │                 │ │
│          │  │ │ [Edit] View   │ │ [Edit] View   │                 │ │
│          │  │ └───────────────┘ └───────────────┘                 │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │                                                          │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │ E) EVIDENCE & CERTIFICATES                          │ │
│          │  │ 2 of 5 added  ▓▓▓▓▓▓░░░░░░░░ 40%                   │ │
│          │  │ ✅ Sustainability  ⏳ Proof capacity                 │ │
│          │  │ [Upload certificate]                                │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │                                                          │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │ F) MAP (Optional)                                   │ │
│          │  │ [Add your property ↗]                               │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │                                                          │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │ G) EXPLAINERS                                       │ │
│          │  │ [Panel 1] [Panel 2] [Panel 3]                       │ │
│          │  │           ● ○ ○                                     │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │                                                          │
└──────────┴──────────────────────────────────────────────────────────┘
```

---

## Spacing Guidelines

| Element | Spacing |
|---------|---------|
| Section gap | 32px |
| Card internal padding | 24px |
| KPI tile gap | 16px |
| Listing card gap | 16px |
| Button to helper text | 8px |

---

## Typography Usage

| Element | Style |
|---------|-------|
| Page title | H1 / Display |
| Section header | H2 / Heading |
| Card title | H3 / Heading |
| Body text | Body / Default |
| Helper text | Body / Small |
| Button label | Label / Default |
| Status chip | Label / Small |
