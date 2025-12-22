# Figma Build Instructions — Bankability Framework Components

**File:** `Z3htI9lFecgDFrEb4S6Qn2`
**Status:** Ready for implementation

---

## File Setup

### Step 1: Rename File
```
ABFI — Bankability Framework Components
```

### Step 2: Create Pages
```
00 — Element Studies (Reference Only)
01 — Tokens & Variables
02 — UI Components
03 — Domain Components
99 — Design Authority Locked
```

---

## Component #1: BF/BankabilityScoreBadge

**Location:** Page `03 — Domain Components`

### Create Component

1. Create a Frame (Auto Layout, Vertical)
2. Name it: `BF/BankabilityScoreBadge`

### Add Variants

Create variant property `grade`:
- `excellent`
- `good`
- `medium`
- `risk`

Create variant property `size`:
- `sm`
- `md`

Create variant property `context`:
- `grower`
- `developer`
- `lender`
- `export`

### Layer Structure

```
BF/BankabilityScoreBadge
├── Label (Text) → "Bankability"
├── Grade (Text) → "Good"
└── Descriptor (Text) → "Positive bankability with minor gaps"
```

### Text Properties (Figma Component Properties)

| Property | Type | Default |
|----------|------|---------|
| `label` | Text | "Bankability" |
| `gradeText` | Text | (varies by variant) |
| `descriptor` | Text | (varies by variant) |

### Boolean Properties

| Property | Default |
|----------|---------|
| `showDescriptor` | true |

### Typography (md size)

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Label | Inter | 12px | Medium | `#666666` |
| Grade | Inter | 18px | SemiBold | `#1A1A1A` |
| Descriptor | Inter | 14px | Regular | `#333333` |

### Typography (sm size)

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Label | Inter | 10px | Medium | `#666666` |
| Grade | Inter | 14px | SemiBold | `#1A1A1A` |
| Descriptor | Inter | 12px | Regular | `#333333` |

### Spacing (md)

| Property | Value |
|----------|-------|
| Padding | 16px |
| Gap (label→grade) | 4px |
| Gap (grade→descriptor) | 8px |

### Spacing (sm)

| Property | Value |
|----------|-------|
| Padding | 12px |
| Gap (label→grade) | 2px |
| Gap (grade→descriptor) | 6px |

### Border by Context

| Context | Border |
|---------|--------|
| `grower` | 1px solid `#E0E0E0` |
| `developer` | 1px solid `#D0D0D0` |
| `lender` | 1px solid `#C0C0C0` |
| `export` | 1px solid `#000000` |

### Grade Text Defaults

| Variant | gradeText | descriptor |
|---------|-----------|------------|
| `excellent` | "Excellent" | "Strong bankability indicators across all dimensions" |
| `good` | "Good" | "Positive bankability with minor gaps" |
| `medium` | "Medium" | "Moderate bankability requiring attention" |
| `risk` | "Risk" | "Elevated risk factors identified" |

### Annotation (Add as comment)

```
Implements: FIGMA_BANKABILITY_AUTHORITY_SCHEMA.md
Task ID: m9Q86N72eYggNfWch4qnNL
No semantic changes permitted
```

---

## Component #2: BF/ContractSecurityBadge

**Location:** Page `03 — Domain Components`

### Variants

| Property | Values |
|----------|--------|
| `grade` | `GC1`, `GC2`, `GC3`, `GC4` |
| `layout` | `inline`, `stacked` |
| `context` | `grower`, `developer`, `lender`, `export` |

### Layer Structure

```
BF/ContractSecurityBadge
├── Title (Text) → "Contract security"
├── Grade (Text) → "GC2 — Indicative"
└── Description (Text) → "Medium-term contracted"
```

### Grade Defaults (Locked Copy)

| Grade | Label |
|-------|-------|
| `GC1` | "Binding, long-term offtake" |
| `GC2` | "Medium-term contracted" |
| `GC3` | "Short-term/rolling" |
| `GC4` | "No contractual security" |

### Typography

Same as BankabilityScoreBadge

### Max Width

120px (fits in table cell)

---

## Component #3: BF/TechnologyReadinessIndicator

**Location:** Page `03 — Domain Components`

### Variants

| Property | Values |
|----------|--------|
| `level` | `TR1`, `TR2`, `TR3`, `TR4` |
| `presentation` | `badge`, `row` |
| `context` | `grower`, `developer`, `lender`, `export` |

### Layer Structure

```
BF/TechnologyReadinessIndicator
├── Label (Text) → "Technology readiness"
├── Level (Text) → "TR2 — Demonstrated"
└── SupportingText (Text) → Optional
```

### Level Defaults

| Level | Text |
|-------|------|
| `TR1` | "Proven at scale" |
| `TR2` | "Demonstrated" |
| `TR3` | "Validated" |
| `TR4` | "Early stage" |

### ⚠️ Export Context

Must use WHITE background (not dark theme from Nano Banana)

---

## Component #4: BF/CarbonIntensityRating

**Location:** Page `03 — Domain Components`

### Variants

| Property | Values |
|----------|--------|
| `rating` | `CI-A`, `CI-B`, `CI-C`, `CI-D` |
| `showExplanation` | `true`, `false` |
| `context` | `grower`, `developer`, `lender`, `export` |

### Layer Structure

```
BF/CarbonIntensityRating
├── Label (Text) → "Carbon intensity"
├── Rating (Text) → "CI-B — Low intensity"
└── Explanation (Text) → Optional
```

### Rating Defaults

| Rating | Band Text |
|--------|-----------|
| `CI-A` | "Very low intensity" |
| `CI-B` | "Low intensity" |
| `CI-C` | "Moderate intensity" |
| `CI-D` | "High intensity" |

---

## Component #5: BF/ConfidenceIndicator

**Location:** Page `03 — Domain Components`

### Variants

| Property | Values |
|----------|--------|
| `level` | `high`, `medium`, `low` |
| `display` | `chip`, `inline`, `block` |
| `context` | `grower`, `developer`, `lender`, `export` |

### Layer Structure (Block)

```
BF/ConfidenceIndicator
├── Label (Text) → "Confidence"
├── Level (Text) → "High"
└── Basis (Text) → "Evidence complete & recent"
```

### Layer Structure (Chip)

```
BF/ConfidenceIndicator
└── ChipText (Text) → "Confidence: High"
```

### Level Defaults

| Level | Basis |
|-------|-------|
| `high` | "Evidence complete & recent" |
| `medium` | "Some gaps or aging evidence" |
| `low` | "Significant gaps or outdated" |

---

## Validation Checklist

After creating each component:

- [ ] All variants exist
- [ ] Text properties have defaults
- [ ] Export context has no grey/dark backgrounds
- [ ] Border is black for export context
- [ ] Annotation comment added
- [ ] Component is published

---

## Implementation Order

1. ✅ BF/BankabilityScoreBadge
2. ✅ BF/ContractSecurityBadge
3. ✅ BF/TechnologyReadinessIndicator
4. ✅ BF/CarbonIntensityRating
5. ✅ BF/ConfidenceIndicator
6. BF/BankabilityDriversList
7. BF/MonitoringStatusIndicator
8. BF/ListingSummaryCard
9. BF/ExportBankabilityBlock
10. BF/KPITile

---

## After All Components Built

1. Lock components (Figma permissions)
2. Create page `99 — Design Authority Locked`
3. Add statement:
   ```
   Components on page 03 are authoritative
   Date: [today]
   Commit: 93d78e7
   Version: 1.0
   ```
