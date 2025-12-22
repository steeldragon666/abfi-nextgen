# ABFI — Bankability Framework
## Figma Component Property Schemas (Authoritative)

**Purpose:** Direct Figma implementation · 1:1 React prop mapping · Governance intact

---

## Scope Covered

Matches the 10 element studies:

| # | Component | Element Study Task |
|---|-----------|-------------------|
| 1 | Bankability Score | `m9Q86N72eYggNfWch4qnNL` |
| 2 | GC1–GC4 (Contract Security) | `j8g7mwavRqCpNdHeLWCZZP` |
| 3 | TR1–TR4 (Technology Readiness) | `cZvvyVmDs9HYFBKGiVjUWp` |
| 4 | CI-A–CI-D (Carbon Intensity) | `79VgD7s9uzo2fEQ2Qhv8qV` |
| 5 | Confidence Indicator | `KCQDhSKcpq6jqwJ5mhTKUT` |
| 6 | Drivers List | `ZfgBNhq4zVtiEpReW55EG9` |
| 7 | Monitoring Status | `n7YYdWQggxSLwemUyB5ZTw` |
| 8 | Listing Card Density | `25frGGhFLau9VqpXCaRZjf` |
| 9 | Export-ready representation | `NfNsPS3gaDA6E5Mt5Xh7SR` |
| 10 | KPI Typography | `GDh2ph4HVUoSD4SeVyRK2b` |

---

## Global Rules (Apply To All Components)

### Naming
- **Prefix:** `BF/` (Bankability Framework)
- Use sentence case for visible labels
- Use enum-like names for variants

### Properties
- **Variants** → semantic meaning only
- **Text properties** → capped lengths (see below)
- No colour-only meaning
- All states must be representable in grayscale

---

## 1️⃣ BF/BankabilityScoreBadge

**Purpose:** Primary summary indicator. Must be understandable standalone (e.g. in exports).

### Component Structure
- Label
- Grade
- Descriptor (plain English)

### Figma Variants

| Variant | Options |
|---------|---------|
| `grade` | `excellent` \| `good` \| `moderate` \| `elevated-risk` |
| `size` | `sm` \| `md` |
| `context` | `ui` \| `export` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `label` | Text | Default: "Bankability" |
| `gradeText` | Text | Auto-mapped (e.g. "Good") |
| `descriptor` | Text | Max 80 chars |
| `showDescriptor` | Boolean | Default: true |

### Notes
- No numeric score required
- Export variant removes borders & icons

---

## 2️⃣ BF/ContractSecurityGrade (GC1–GC4)

**Purpose:** Represents contractual robustness without legal opinion.

### Figma Variants

| Variant | Options |
|---------|---------|
| `grade` | `GC1` \| `GC2` \| `GC3` \| `GC4` |
| `layout` | `inline` \| `stacked` |
| `context` | `ui` \| `export` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `title` | Text | Default: "Contract security" |
| `gradeLabel` | Text | "GC2 — Indicative" |
| `description` | Text | Max 100 chars |

### Locked Copy

| Grade | Label |
|-------|-------|
| GC1 | "Binding, long-term offtake" |
| GC2 | "Medium-term contracted" |
| GC3 | "Short-term/rolling" |
| GC4 | "No contractual security" |

---

## 3️⃣ BF/TechnologyReadinessIndicator (TR1–TR4)

**Purpose:** Communicates technical maturity without hype.

### Figma Variants

| Variant | Options |
|---------|---------|
| `level` | `TR1` \| `TR2` \| `TR3` \| `TR4` |
| `presentation` | `badge` \| `row` |
| `context` | `ui` \| `export` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `label` | Text | Default: "Technology readiness" |
| `levelText` | Text | "TR3 — Demonstrated" |
| `supportingText` | Text | Optional, max 90 chars |

---

## 4️⃣ BF/CarbonIntensityBand (CI-A → CI-D)

**Purpose:** Relative carbon performance indicator (non-numeric by default).

### Figma Variants

| Variant | Options |
|---------|---------|
| `band` | `CI-A` \| `CI-B` \| `CI-C` \| `CI-D` |
| `showExplanation` | `true` \| `false` |
| `context` | `ui` \| `export` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `label` | Text | Default: "Carbon intensity" |
| `bandText` | Text | "CI-B — Low intensity" |
| `explanation` | Text | Max 100 chars |

### Rule
> Numeric gCO₂e only shown in advanced / lender views.

---

## 5️⃣ BF/ConfidenceIndicator

**Purpose:** Meta-quality signal across all assessments.

### Figma Variants

| Variant | Options |
|---------|---------|
| `confidence` | `high` \| `medium` \| `low` |
| `display` | `chip` \| `inline` \| `block` |
| `context` | `ui` \| `export` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `label` | Text | Default: "Confidence level" |
| `confidenceText` | Text | Auto ("High") |
| `explanation` | Text | Max 70 chars |

### Locked Meaning

| Level | Definition |
|-------|------------|
| High | Evidence complete & recent |
| Medium | Some gaps or aging evidence |
| Low | Significant gaps or outdated evidence |

---

## 6️⃣ BF/BankabilityDriversList

**Purpose:** Explain why a score exists. Mandatory for transparency.

### Figma Variants

| Variant | Options |
|---------|---------|
| `density` | `comfortable` \| `compact` |
| `context` | `ui` \| `export` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `title` | Text | Default: "Key drivers" |
| `driversPositive` | List\<Text\> | Max 3 |
| `driversRisk` | List\<Text\> | Max 3 |
| `showIcons` | Boolean | Default: false |

### Rules
- Max 6 total drivers
- Export version flattens to text-only

---

## 7️⃣ BF/MonitoringStatusIndicator

**Purpose:** Indicates ongoing oversight without prediction.

### Figma Variants

| Variant | Options |
|---------|---------|
| `status` | `active` \| `attention` \| `issue` \| `not-enabled` |
| `display` | `inline` \| `card` |
| `context` | `ui` \| `export` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `label` | Text | Default: "Monitoring status" |
| `statusText` | Text | "Active monitoring" |
| `detail` | Text | Optional, max 80 chars |

### Mandatory State
> Explicit "No monitoring enabled" when applicable

---

## 8️⃣ BF/ListingSummaryCard (Bankability Density)

**Purpose:** Show bankability without overwhelming listings.

### Figma Variants

| Variant | Options |
|---------|---------|
| `density` | `low` \| `standard` \| `lender` |
| `context` | `ui` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `title` | Text | Max 32 chars |
| `bankabilityBadge` | Instance | BF/BankabilityScoreBadge |
| `confidenceIndicator` | Instance | Optional |
| `secondaryMetric` | Instance | GC / TR / CI |
| `showDrivers` | Boolean | Default: false |

### Rule
> Never more than 2 bankability sub-elements visible

---

## 9️⃣ BF/ExportBankabilityBlock

**Purpose:** Canonical export-safe representation.

### Figma Variants

| Variant | Options |
|---------|---------|
| `format` | `summary` \| `full` |
| `audience` | `lender` \| `government` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `heading` | Text | "Bankability assessment" |
| `assessmentText` | Text | Plain English |
| `confidenceIndicator` | Instance | Required |
| `driversList` | Instance | Optional |

### Rules
- No icons
- No colours without labels
- Print-safe only

---

## 🔟 BF/KPITypographyScale

**Purpose:** Consistent metric hierarchy across dashboards.

### Figma Variants

| Variant | Options |
|---------|---------|
| `role` | `grower` \| `developer` \| `lender` |
| `emphasis` | `primary` \| `secondary` |

### Properties

| Property | Type | Rules |
|----------|------|-------|
| `valueText` | Text | Numeric or status |
| `labelText` | Text | Always present |
| `helperText` | Text | Optional |

---

## Implementation Order (Important)

When moving into Figma:

1. **Create Variant-only components first**
2. **Apply text property caps**
3. **Implement export variants immediately**
4. **Lock components** (Figma permissions)
5. **Only then assemble patterns/screens**

---

## Summary

You now have:

| Capability | Status |
|------------|--------|
| Complete Bankability atomic system | ✅ |
| Clear semantic boundaries | ✅ |
| Export-safe design | ✅ |
| Direct Figma → React mapping | ✅ |
| Zero ambiguity for contributors | ✅ |

---

## React Prop Mapping Reference

```typescript
// BF/BankabilityScoreBadge → BankabilityScoreBadge.tsx
interface BankabilityScoreBadgeProps {
  grade: 'excellent' | 'good' | 'moderate' | 'elevated-risk';
  size?: 'sm' | 'md';
  context?: 'ui' | 'export';
  label?: string;
  descriptor?: string;
  showDescriptor?: boolean;
}

// BF/ContractSecurityGrade → ContractSecurityGrade.tsx
interface ContractSecurityGradeProps {
  grade: 'GC1' | 'GC2' | 'GC3' | 'GC4';
  layout?: 'inline' | 'stacked';
  context?: 'ui' | 'export';
  description?: string;
}

// BF/TechnologyReadinessIndicator → TechnologyReadinessIndicator.tsx
interface TechnologyReadinessIndicatorProps {
  level: 'TR1' | 'TR2' | 'TR3' | 'TR4';
  presentation?: 'badge' | 'row';
  context?: 'ui' | 'export';
  supportingText?: string;
}

// BF/CarbonIntensityBand → CarbonIntensityBand.tsx
interface CarbonIntensityBandProps {
  band: 'CI-A' | 'CI-B' | 'CI-C' | 'CI-D';
  showExplanation?: boolean;
  context?: 'ui' | 'export';
  explanation?: string;
}

// BF/ConfidenceIndicator → ConfidenceIndicator.tsx
interface ConfidenceIndicatorProps {
  confidence: 'high' | 'medium' | 'low';
  display?: 'chip' | 'inline' | 'block';
  context?: 'ui' | 'export';
  explanation?: string;
}

// BF/BankabilityDriversList → BankabilityDriversList.tsx
interface BankabilityDriversListProps {
  density?: 'comfortable' | 'compact';
  context?: 'ui' | 'export';
  driversPositive: string[]; // max 3
  driversRisk: string[]; // max 3
  showIcons?: boolean;
}

// BF/MonitoringStatusIndicator → MonitoringStatusIndicator.tsx
interface MonitoringStatusIndicatorProps {
  status: 'active' | 'attention' | 'issue' | 'not-enabled';
  display?: 'inline' | 'card';
  context?: 'ui' | 'export';
  detail?: string;
}
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `FIGMA_EXECUTION_GUIDE.md` | 6-phase implementation workflow |
| `FIGMA_IMPLEMENTATION_PLAN.md` | High-level 8-phase plan |
| `NANO_BANANA_ELEMENT_STUDIES.md` | Generation prompts |
| `FIGMA_DESIGN_AUTHORITY_DOCUMENT.md` | Governance framework |
