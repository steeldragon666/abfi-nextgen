# ABFI Bankability Framework — Authority Schema

**Status:** Authoritative · Binding on all implementations

---

## Contract Scope

These schemas are the contract between:
- Nano Banana reference outputs
- Figma components
- React components
- Exports (PDF / Gov / Covenant)

> **If something cannot map cleanly to these schemas → it does not enter Figma.**

---

## Part 1 — Component Property Schemas

---

### 1️⃣ Bankability Score Badge

**Element Study:** #1 (`m9Q86N72eYggNfWch4qnNL`)

**Component name (Figma):** `Domain/BankabilityScoreBadge`

**Purpose:** Provide a single, defensible summary of bankability status.

#### Figma Properties

| Property | Type | Allowed Values | Notes |
|----------|------|----------------|-------|
| `band` | Variant | `excellent`, `good`, `medium`, `risk` | Required |
| `label` | Text | Free text | Default: "Bankability" |
| `score` | Text | `—` or `0–100` | Numeric optional |
| `showScore` | Boolean | `true` / `false` | Default: false |
| `meaning` | Text | 1 sentence | Plain English |
| `confidence` | Variant | `high`, `medium`, `low` | Optional |
| `size` | Variant | `sm`, `md` | No lg allowed |
| `exportSafe` | Boolean | `true` | Must exist |

#### Hard Rules
- ❌ No circular gauges
- ❌ No progress rings
- ❌ No colour-only meaning
- ✅ Must work as pure text block in PDF

---

### 2️⃣ Contract Security Classification (GC1–GC4)

**Element Study:** #2 (`j8g7mwavRqCpNdHeLWCZZP`)

**Component name:** `Domain/ContractSecurityBadge`

**Purpose:** Represent counterparty & contractual strength without legal claims.

#### Figma Properties

| Property | Type | Allowed Values |
|----------|------|----------------|
| `grade` | Variant | `GC1`, `GC2`, `GC3`, `GC4` |
| `label` | Text | Default: "Contract security" |
| `description` | Text | 1 line max |
| `tone` | Variant | `neutral`, `warning`, `risk` |
| `showTooltip` | Boolean | `true` / `false` |
| `exportSafe` | Boolean | `true` |

#### Rules
- GC grades must never be described as "secure / guaranteed"
- Tooltip text must be static, not contextual

---

### 3️⃣ Technology Readiness Indicator (TR1–TR4)

**Element Study:** #3 (`cZvvyVmDs9HYFBKGiVjUWp`)

**Component name:** `Domain/TechnologyReadinessIndicator`

**Purpose:** Indicate deployment maturity, not innovation quality.

#### Figma Properties

| Property | Type | Allowed Values |
|----------|------|----------------|
| `level` | Variant | `TR1`, `TR2`, `TR3`, `TR4` |
| `label` | Text | Default: "Technology readiness" |
| `descriptor` | Text | e.g. "Commercial deployment" |
| `confidence` | Variant | `high`, `medium`, `low` |
| `exportSafe` | Boolean | `true` |

#### Rules
- ❌ No "TRL" terminology (avoid standards confusion)
- ❌ No timelines or forecasts

---

### 4️⃣ Carbon Intensity Rating (CI-A to CI-D)

**Element Study:** #4 (`79VgD7s9uzo2fEQ2Qhv8qV`)

**Component name:** `Domain/CarbonIntensityRating`

**Purpose:** Provide relative carbon positioning, not emissions accounting.

#### Figma Properties

| Property | Type | Allowed Values |
|----------|------|----------------|
| `rating` | Variant | `CI-A`, `CI-B`, `CI-C`, `CI-D` |
| `label` | Text | Default: "Carbon intensity" |
| `contextNote` | Text | Optional |
| `methodologyRef` | Text | Short reference |
| `exportSafe` | Boolean | `true` |

#### Rules
- ❌ No numeric emissions values in badge
- ❌ No claims of compliance
- ✅ Must degrade gracefully to text-only

---

### 5️⃣ Confidence Indicator

**Element Study:** #5 (`KCQDhSKcpq6jqwJ5mhTKUT`)

**Component name:** `Domain/ConfidenceIndicator`

**Purpose:** Explain how reliable the assessment is, not how good it is.

#### Figma Properties

| Property | Type | Allowed Values |
|----------|------|----------------|
| `level` | Variant | `high`, `medium`, `low` |
| `label` | Text | Default: "Confidence" |
| `basis` | Text | 1 short line |
| `exportSafe` | Boolean | `true` |

#### Rules
- Must always include a basis
- ❌ No colour-only confidence expression

---

### 6️⃣ Bankability Drivers List

**Element Study:** #6 (`ZfgBNhq4zVtiEpReW55EG9`)

**Component name:** `Domain/BankabilityDriversList`

**Purpose:** Explain why the score exists.

#### Figma Properties

| Property | Type | Allowed Values |
|----------|------|----------------|
| `driverCount` | Variant | `1`, `2`, `3` |
| `driver1Label` | Text | Required |
| `driver1Tone` | Variant | `positive`, `neutral`, `risk` |
| `driver2Label` | Text | Optional |
| `driver2Tone` | Variant | same |
| `driver3Label` | Text | Optional |
| `driver3Tone` | Variant | same |
| `exportSafe` | Boolean | `true` |

#### Rules
- Max 3 drivers
- No numeric scoring here
- Must be readable as bullets in export

---

### 7️⃣ Monitoring Status Indicator

**Element Study:** #7 (`n7YYdWQggxSLwemUyB5ZTw`)

**Component name:** `Domain/MonitoringStatusIndicator`

**Purpose:** Indicate ongoing oversight state, not prediction.

#### Figma Properties

| Property | Type | Allowed Values |
|----------|------|----------------|
| `status` | Variant | `active`, `attention`, `issue` |
| `label` | Text | Default: "Monitoring" |
| `summary` | Text | 1 line |
| `exportSafe` | Boolean | `true` |

#### Rules
- Must include explicit text ("No issues detected")
- ❌ No trend arrows or forecasts

---

### 8️⃣ Listing Summary Card (Bankability Density Variant)

**Element Study:** #8 (`25frGGhFLau9VqpXCaRZjf`)

**Component name:** `Domain/ListingSummaryCard`

#### Bankability-specific Properties

| Property | Type | Allowed Values |
|----------|------|----------------|
| `density` | Variant | `comfortable`, `compact` |
| `showBankability` | Boolean | `true` |
| `showConfidence` | Boolean | `true` |
| `showCarbon` | Boolean | `true` / `false` |
| `exportSafe` | Boolean | `true` |

---

### 9️⃣ Export-Ready Bankability Block

**Element Study:** #9 (`NfNsPS3gaDA6E5Mt5Xh7SR`)

**Component name:** `Export/BankabilitySummaryBlock`

**Purpose:** PDF / DOCX authoritative representation.

#### Figma Properties

| Property | Type | Allowed Values |
|----------|------|----------------|
| `assessment` | Variant | `excellent`, `good`, `medium`, `risk` |
| `confidence` | Variant | `high`, `medium`, `low` |
| `summaryText` | Text | 2–3 lines |
| `showDrivers` | Boolean | `true` / `false` |
| `exportSafe` | Boolean | `true` (locked) |

#### Rules
- No icons
- No colour dependency
- Must render identically in grayscale

---

### 🔟 KPI Tiles — Bankability Typography

**Element Study:** #10 (`GDh2ph4HVUoSD4SeVyRK2b`)

**Component name:** `Domain/KPITile`

#### Bankability Typography Constraints

| Property | Type | Allowed Values |
|----------|------|----------------|
| `metricLabel` | Text | Required |
| `metricValue` | Text | Short |
| `helperText` | Text | Optional |
| `tone` | Variant | `neutral`, `warning`, `risk` |
| `size` | Variant | `md` only |
| `exportSafe` | Boolean | `true` |

---

## Part 2 — Nano Banana Audit Checklist

**Run this on EVERY generated output**

For each Nano Banana task result, answer YES / NO:

### Schema Compliance
- [ ] Can every visible element map to a property above?
- [ ] Are all variants from allowed sets only?
- [ ] No implicit properties (e.g. colour meaning)?

### Authority Compliance
- [ ] No new component invented?
- [ ] No visual metaphor (gauges, rings, charts)?
- [ ] No predictive language?

### Export Survivability
- [ ] Fully legible in grayscale?
- [ ] Still meaningful if icons removed?
- [ ] Text-first hierarchy?

### Role Neutrality
- [ ] Does not privilege Grower/Dev/Lender visually?
- [ ] Can be reused across roles?

---

### Decision Gate

| Result | Action |
|--------|--------|
| All YES | ✅ Implement in Figma |
| Any NO | ⚠️ Reference only, do not implement |

---

## Implementation Workflow

### Step 1 — Wait for Nano Banana tasks to finish

### Step 2 — For each task:
1. Pick one winner
2. Map it to the schema above
3. Discard the rest

### Step 3 — Implement in Figma
1. Create components with **exact property names**
2. Lock `exportSafe = true` as default
3. Annotate: "Derived from Element Study #[x]"

---

## What This Enables

| Capability | Benefit |
|------------|---------|
| Design-to-data contract | Zero ambiguity |
| Governed visual language | No entropy |
| Safe path from AI reference → institutional system | Audit-ready |

---

## Task Status Reference

| # | Element | Task ID | Status |
|---|---------|---------|--------|
| 1 | Bankability Score Badge | `m9Q86N72eYggNfWch4qnNL` | ✅ Completed |
| 2 | Contract Security GC1-GC4 | `j8g7mwavRqCpNdHeLWCZZP` | ✅ Completed |
| 3 | Technology Readiness TR1-TR4 | `cZvvyVmDs9HYFBKGiVjUWp` | ✅ Completed |
| 4 | Carbon Intensity CI-A-D | `79VgD7s9uzo2fEQ2Qhv8qV` | ✅ Completed |
| 5 | Confidence Indicator | `KCQDhSKcpq6jqwJ5mhTKUT` | ✅ Completed |
| 6 | Bankability Drivers List | `ZfgBNhq4zVtiEpReW55EG9` | ✅ Completed |
| 7 | Monitoring Status | `n7YYdWQggxSLwemUyB5ZTw` | ✅ Completed |
| 8 | ListingSummaryCard Density | `25frGGhFLau9VqpXCaRZjf` | ✅ Completed |
| 9 | Export-Ready Block | `NfNsPS3gaDA6E5Mt5Xh7SR` | ⏳ Running |
| 10 | KPI Tiles Typography | `GDh2ph4HVUoSD4SeVyRK2b` | ✅ Completed |

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FIGMA_BANKABILITY_COMPONENT_SCHEMA.md` | React prop mappings |
| `FIGMA_EXECUTION_GUIDE.md` | Implementation workflow |
| `FIGMA_DESIGN_AUTHORITY_DOCUMENT.md` | Governance framework |
| `NANO_BANANA_ELEMENT_STUDIES.md` | Generation prompts |
