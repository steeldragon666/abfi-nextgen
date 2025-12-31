# Grower Dashboard Component Specifications

**Purpose:** Detailed specs for the 8 core components that compose the Grower Dashboard screen.

---

## 1) Domain/RoleHeader (Grower Variant)

**Figma Component:** `Domain/RoleHeader`
**Code File:** `components/RoleHeader.tsx`

### Variants

| Property | Options | Default |
|----------|---------|---------|
| `role` | `grower` \| `developer` \| `finance` | `grower` |
| `state` | `incomplete` \| `ready` \| `actionRequired` | `incomplete` |
| `layout` | `standard` \| `compact` | `standard` (grower uses standard) |

### Figma Properties

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `title` | text | "Grower Dashboard" | max 28 chars |
| `statusLabel` | text | "Profile incomplete", "Ready to receive inquiries" | max 24 chars |
| `statusTone` | variant | `neutral` \| `success` \| `warning` \| `risk` | |
| `progressValue` | number | 0–100 | |
| `progressLabel` | text | "Complete 2 more steps to become visible" | max 60 chars |
| `primaryActionLabel` | text | "Continue setup" / "Create a listing" | |
| `showSecondaryLink` | boolean | | |
| `secondaryLinkLabel` | text | "How scoring works" | |
| `showHelpLink` | boolean | | |
| `helpLinkLabel` | text | "Get help" | |

### Content Rules

- `title` max 28 chars
- `statusLabel` max 24 chars
- `progressLabel` max 60 chars (single line desktop, wraps mobile)

### React Props Contract

```typescript
interface RoleHeaderProps {
  role: "grower" | "developer" | "finance";
  title: string;
  status?: {
    label: string;
    tone: "neutral" | "success" | "warning" | "risk";
  };
  progress?: {
    value: number;
    label?: string;
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryLink?: {
    label: string;
    onClick: () => void;  // or href
  };
  helpLink?: {
    label: string;
    onClick: () => void;  // or href
  };
}
```

### Visual Layout

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

## 2) Pattern/NextStepCard

**Figma Component:** `Pattern/NextStepCard`
**Code Composition:** `ui/card.tsx` + `ui/progress.tsx` + `ui/button.tsx` + `ui/badge.tsx`
**Pages Linked:** `ProducerPropertyDetails`, `ProducerProductionProfile`, `CertificateUpload`

### Variants

| Property | Options | Default |
|----------|---------|---------|
| `state` | `default` \| `complete` \| `blocked` | `default` |
| `layout` | `twoColumn` \| `singleColumn` | `twoColumn` (responsive) |

### Figma Properties

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `title` | text | "Your next best step" | |
| `body` | text | 1–2 lines | max 120 chars |
| `ctaLabel` | text | "Add property details" | |
| `ctaStyle` | variant | `primary` \| `secondary` | |
| `microcopy` | text | "Takes ~3 minutes" | |
| `checklistItem1Label` | text | "Property boundary" | |
| `checklistItem1State` | variant | `done` \| `todo` | |
| `checklistItem2Label` | text | | |
| `checklistItem2State` | variant | | |
| `checklistItem3Label` | text | | |
| `checklistItem3State` | variant | | |
| `showChecklist` | boolean | `true` | |

### Content Rules

- `body` max 120 chars
- Checklist max 3 items
- If `state = blocked`, replace microcopy with Alert style note

### React Props Contract

```typescript
interface NextStepCardProps {
  title: string;
  body: string;
  cta: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  microcopy?: string;
  checklist?: {
    label: string;
    state: "done" | "todo";
  }[];
  state?: "default" | "complete" | "blocked";
}
```

### Visual Layout

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

## 3) Domain/StatTile (Grower KPI Tile)

**Figma Component:** `Domain/StatTile`
**Code Composition:** `layout/StatsGrid.tsx` + `ui/card.tsx` + optional DeltaIndicator
**Note:** Treat as Figma component + code pattern (no separate file yet)

### Variants

| Property | Options | Default |
|----------|---------|---------|
| `tone` | `neutral` \| `success` \| `warning` \| `risk` \| `info` | `neutral` |
| `density` | `comfortable` \| `compact` | `comfortable` (grower uses comfortable) |
| `hasDelta` | boolean | `false` |
| `hasActionLink` | boolean | `false` |

### Figma Properties

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `label` | text | "Visibility" | |
| `value` | text | "Standard" | max 14 chars |
| `helper` | text | "How often buyers can find you" | max 48 chars |
| `delta` | text | "↑ improving" / "↓ needs attention" | |
| `actionLabel` | text | "Add evidence" | |
| `icon` | instance swap | optional | |

### Content Rules

- `value` max 14 chars
- `helper` max 48 chars
- Only 1 action link per tile

### React Props Contract

```typescript
interface StatTileProps {
  label: string;
  value: string;
  helper?: string;
  tone?: "neutral" | "success" | "warning" | "risk" | "info";
  delta?: {
    label: string;
    direction: "up" | "down" | "flat";
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}
```

### Visual Layout

```
┌─────────────────┐
│ Visibility      │
│                 │
│ Standard        │
│ ↑ improving     │
│                 │
│ How often       │
│ buyers can      │
│ find you        │
│                 │
│ [Add evidence]  │
└─────────────────┘
```

---

## 4) Domain/ListingSummaryCard

**Figma Component:** `Domain/ListingSummaryCard`
**Code Pages:** `ProducerMarketplaceListing.tsx`, `SupplierFeedstocks.tsx`, `FeedstockDetail.tsx`
**Code Composition:** `ui/card.tsx` + `ui/badge.tsx` + `ScoreBadge` + `ui/button.tsx`

### Variants

| Property | Options | Default |
|----------|---------|---------|
| `status` | `draft` \| `pending` \| `live` \| `archived` | `draft` |
| `scoreBand` | `excellent` \| `good` \| `needsWork` \| `risk` | `good` |
| `layout` | `standard` \| `compact` | `standard` |

### Figma Properties

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `listingName` | text | "Wheat Stubble 2024" | max 32 chars (truncate) |
| `statusLabel` | text | "Draft" / "Pending verification" / "Live" | |
| `feedstockType` | text | "Wheat stubble" | |
| `availabilityWindow` | text | "Jan–Mar 2026" | |
| `score` | number | 0–100 | |
| `scoreBand` | variant | | |
| `primaryActionLabel` | text | "Edit" | |
| `secondaryActionLabel` | text | "View" | |
| `showSecondaryAction` | boolean | `true` | |

### Content Rules

- `listingName` max 32 chars (truncate)
- Show max 2 attributes: `feedstockType` + `availabilityWindow`
- Never show more than 2 chips/tags

### React Props Contract

```typescript
interface ListingSummaryCardProps {
  name: string;
  status: "draft" | "pending" | "live" | "archived";
  feedstockType?: string;
  availabilityWindow?: string;
  score?: {
    value: number;
    band: "excellent" | "good" | "needsWork" | "risk";
  };
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}
```

### Visual Layout

```
┌───────────────────────┐
│ Wheat Stubble 2024    │
│ ┌────┐ ┌──────┐       │
│ │Live│ │Good  │       │
│ └────┘ └──────┘       │
│                       │
│ Wheat stubble         │
│ 500t / Mar-May 2024   │
│                       │
│ [Edit]  View          │
└───────────────────────┘
```

---

## 5) Domain/EvidenceProgressCard

**Figma Component:** `Domain/EvidenceProgressCard`
**Code Pages:** `CertificateUpload.tsx`, `EvidenceManagement.tsx`, `EvidenceVaultDashboard.tsx`
**Code Composition:** `ui/card.tsx` + `ui/progress.tsx` + `ui/badge.tsx` + `ui/button.tsx`

### Variants

| Property | Options | Default |
|----------|---------|---------|
| `state` | `low` \| `medium` \| `high` | `low` |
| `layout` | `list` \| `compact` | `list` |

### Figma Properties

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `title` | text | "Evidence & Certificates" | |
| `progressLabel` | text | "2 of 5 recommended items added" | |
| `progressValue` | number | 0–100 | |
| `item1Label` | text | "Sustainability certificate" | |
| `item1State` | variant | `done` \| `missing` | |
| `item2Label` | text | | |
| `item2State` | variant | | |
| `item3Label` | text | | |
| `item3State` | variant | | |
| `item4Label` | text | | |
| `item4State` | variant | | |
| `item5Label` | text | | |
| `item5State` | variant | | |
| `ctaLabel` | text | "Upload certificate" | |
| `secondaryLinkLabel` | text | "Why this matters" | |
| `showSecondaryLink` | boolean | | |

### Content Rules

- Max 5 items
- Always include plain-English one-liner under title:
  - "More evidence increases buyer confidence and bankability."

### React Props Contract

```typescript
interface EvidenceProgressCardProps {
  title: string;
  progress: {
    value: number;
    label: string;
  };
  items: {
    label: string;
    state: "done" | "missing";
  }[];  // max 5
  cta: {
    label: string;
    onClick: () => void;
  };
  secondaryLink?: {
    label: string;
    onClick: () => void;
  };
  tone?: "low" | "medium" | "high";
}
```

### Visual Layout

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
│ [Upload certificate]          Why this matters ↗        │
└─────────────────────────────────────────────────────────┘
```

---

## 6) Domain/BiomassMapCard (Grower Simplified)

**Figma Component:** `Domain/BiomassMapCard`
**Code File:** `maps/BiomassMap.tsx` inside a Card

### Variants

| Property | Options | Default |
|----------|---------|---------|
| `filters` | `collapsed` \| `expanded` | `collapsed` |
| `ctaOverlay` | `on` \| `off` | `on` |
| `legend` | `simple` | `simple` |

### Figma Properties

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `title` | text | "Your properties" | |
| `subtitle` | text | "Add boundaries to improve visibility" | |
| `ctaLabel` | text | "Add your property" | |
| `showLegend` | boolean | | |
| `showFilters` | boolean | | |

### Content Rules

- Legend must be simple (3–5 items max)
- Filters collapsed by default

### React Props Contract

```typescript
interface BiomassMapCardProps {
  title?: string;
  subtitle?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  legend?: {
    label: string;
    tone: string;
  }[];
  filters?: ReactNode;
}
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│ 🗺️ Your Properties                                      │
│ Add boundaries to improve visibility                    │
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

---

## 7) Domain/ExplainerCarousel (Grower Onboarding)

**Figma Component:** `Domain/ExplainerCarousel`
**Code File:** `components/ExplainerCarousel.tsx`

### Variants

| Property | Options | Default |
|----------|---------|---------|
| `variant` | `onboarding` \| `bankability` \| `compliance` | `onboarding` |
| `panelCount` | `3` \| `4` \| `6` | `3` |
| `style` | `light` | `light` |

### Figma Properties

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `panel1Title` | text | "How buyers find you" | |
| `panel1Body` | text | | max 180 chars |
| `panel2Title` | text | "What improves your score" | |
| `panel2Body` | text | | max 180 chars |
| `panel3Title` | text | "What verification means" | |
| `panel3Body` | text | | max 180 chars |
| `showProgressDots` | boolean | `true` | |

### Content Rules

- Each body max 180 chars
- Must avoid jargon
- Include one "what to do next" panel for onboarding variant

### React Props Contract

```typescript
interface ExplainerCarouselProps {
  variant?: "onboarding" | "bankability" | "compliance";
  items: {
    title: string;
    body: string;
    icon?: ReactNode;
  }[];
}
```

### Visual Layout

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

## 8) System/EmptyState (Grower Tone)

**Figma Component:** `System/EmptyState`
**Code File:** `ui/empty.tsx`

### Variants

| Property | Options | Default |
|----------|---------|---------|
| `type` | `noListings` \| `noInquiries` \| `noEvidence` \| `error` | `noListings` |
| `tone` | `neutral` \| `warning` \| `risk` | `neutral` |

### Figma Properties

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `title` | text | "No listings yet" | |
| `description` | text | "Create your first listing to start receiving buyer inquiries." | |
| `ctaLabel` | text | "Create your first listing" | |
| `showCTA` | boolean | `true` | |
| `illustration` | instance swap | optional | |

### Content Rules

- Always provide a next step (CTA or link)
- Avoid blame language

### React Props Contract

```typescript
interface EmptyStateProps {
  variant?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│     📦                                                  │
│     No listings yet                                     │
│                                                         │
│     Create your first listing to start                  │
│     receiving buyer inquiries.                          │
│                                                         │
│     [Create your first listing]                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Grower Dashboard Screen Composition

The Grower Dashboard uses these components in order:

1. `Domain/RoleHeader` (grower variant)
2. `Pattern/NextStepCard`
3. `StatsGrid` containing 3× `Domain/StatTile`
4. `SectionHeader`: "Your listings" + action
5. Grid of `Domain/ListingSummaryCard` (2 columns desktop)
6. `Domain/EvidenceProgressCard`
7. `Domain/BiomassMapCard` (optional)
8. `Domain/ExplainerCarousel` (onboarding, 3 panels)
9. `System/EmptyState` for each section state

---

## Figma Build Order

1. [ ] Create `Domain/RoleHeader` with all variants + properties
2. [ ] Create `Pattern/NextStepCard` with variants
3. [ ] Create `Domain/StatTile` with variants
4. [ ] Create `Domain/ListingSummaryCard` with variants
5. [ ] Create `Domain/EvidenceProgressCard` with variants
6. [ ] Create `Domain/BiomassMapCard` with variants
7. [ ] Create `Domain/ExplainerCarousel` with variants
8. [ ] Create `System/EmptyState` with variants
9. [ ] Compose Grower Dashboard template using components
10. [ ] Create screen states:
    - New grower (no listings, incomplete profile)
    - Active grower (listings live, medium confidence)
    - Issue state (action required)

---

## Recommended Code Alignment

To make Figma ↔ code perfect, consider adding thin wrappers:

| New Component | Purpose |
|---------------|---------|
| `StatTile.tsx` | Pattern → component |
| `ListingSummaryCard.tsx` | Pattern → component |

This prevents 92 pages from inventing their own versions.

---

## Component Dependency Graph

```
GrowerDashboard
├── DashboardLayout
│   └── RoleHeader
├── NextStepCard
│   ├── Card
│   ├── Progress
│   ├── Button
│   └── Badge
├── StatsGrid
│   └── StatTile (×3)
│       └── Card
├── SectionHeader
├── ListingSummaryCard (×N)
│   ├── Card
│   ├── Badge
│   ├── ScoreBadge
│   └── Button
├── EvidenceProgressCard
│   ├── Card
│   ├── Progress
│   └── Button
├── BiomassMapCard
│   ├── Card
│   └── BiomassMap
├── ExplainerCarousel
│   └── Carousel (3 panels)
└── EmptyState (per section)
```
