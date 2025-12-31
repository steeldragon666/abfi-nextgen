# Lender Dashboard — v1 Content Pack

**Design Option:** Same components · Lower interaction · Confidence-first

---

## 1) RoleHeader — Lender

### State A — Monitoring

| Element | Content |
|---------|---------|
| **Title** | Lender Dashboard |
| **Status chip label** | Projects under review |
| **Status chip tone** | `neutral` |
| **Progress value** | — (not shown) |
| **Progress label** | Monitoring bankability and risk signals across projects |
| **Primary action** | View bankability reports |

### State B — Attention Required

| Element | Content |
|---------|---------|
| **Title** | Lender Dashboard |
| **Status chip label** | Risk review required |
| **Status chip tone** | `warning` |
| **Progress value** | — (not shown) |
| **Progress label** | Material changes detected in monitored projects |
| **Primary action** | Review flagged project |

---

## 2) NextStepCard — Lender

### Variant A — New Assessment Available

| Element | Content |
|---------|---------|
| **Title** | New bankability assessment available |
| **Body** | A project has completed feedstock verification and is ready for review. |
| **Primary CTA** | Open assessment |

### Variant B — Risk Update

| Element | Content |
|---------|---------|
| **Title** | Risk update available |
| **Body** | Material changes detected in one or more projects. |
| **Primary CTA** | View risk update |

---

## 3) KPI Tiles (StatsGrid · 3 Tiles)

### Tile 1 — Projects Monitored

| Element | Content |
|---------|---------|
| **Label** | Projects Monitored |
| **Value** | 4 |
| **Helper** | Active projects under review |

### Tile 2 — Bankable Projects

| Element | Content |
|---------|---------|
| **Label** | Bankable Projects |
| **Value** | 2 |
| **Helper** | Meet current lending thresholds |

### Tile 3 — Open Risks

| Element | Content |
|---------|---------|
| **Label** | Open Risks |
| **Value** | 5 |
| **Helper** | Issues requiring review |
| **Action link** | View risks |

---

## 4) Projects Under Review Section

### SectionHeader

| Element | Content |
|---------|---------|
| **Title** | Projects under review |

### ListingSummaryCard — Lender View

| Element | Content |
|---------|---------|
| **Project name** | NT SAF Facility — Phase 1 |
| **Status** | Under review |
| **Score** | Medium confidence |
| **Feedstock secured** | 62% |
| **Verification status** | Partial |
| **Primary action** | View assessment |
| **Secondary action** | View evidence |

### Empty State

| Element | Content |
|---------|---------|
| **Title** | No active projects |
| **Description** | Projects shared with you for review will appear here. |

---

## 5) Risk Signals Card

| Element | Content |
|---------|---------|
| **Title** | Portfolio risk signals |
| **Item 1** | Feedstock concentration — ⚠️ |
| **Item 2** | Counterparty exposure — ⚠️ |
| **Item 3** | Regulatory compliance — ✅ |
| **CTA** | Open risk dashboard |

---

## 6) ExplainerCarousel — Lender (3 Panels)

### Panel 1

| Element | Content |
|---------|---------|
| **Title** | How bankability scores are derived |
| **Body** | Scores combine feedstock security, counterparty quality, technology readiness, and regulatory alignment. |

### Panel 2

| Element | Content |
|---------|---------|
| **Title** | What confidence levels mean |
| **Body** | Confidence reflects evidence completeness and verification status of underlying supply data. |

### Panel 3

| Element | Content |
|---------|---------|
| **Title** | How to interpret risk signals |
| **Body** | Risk signals highlight concentration, counterparty, and compliance factors requiring attention. |

---

## Lender Dashboard States to Build

### State 1: Monitoring (Default)
- RoleHeader: State A (neutral, monitoring)
- NextStepCard: Variant A (new assessment)
- KPI Tiles: Normal values
- Projects: 2-4 under review
- Risks: Some warnings

### State 2: Attention Required
- RoleHeader: State B (warning, review required)
- NextStepCard: Variant B (risk update)
- KPI Tiles: Higher risk count
- Projects: Flagged project highlighted
- Risks: Multiple warnings

---

## Sample Project Names (Lender View)

| Name | Location | Type |
|------|----------|------|
| NT SAF Facility — Phase 1 | Northern Territory | SAF Production |
| QLD Bioethanol Expansion | Queensland | Bioethanol |
| Brisbane Renewable Fuels | Queensland | Renewable Diesel |
| Gippsland Biomethane | Victoria | Biomethane |
| SA Green Hydrogen Hub | South Australia | Green Hydrogen |

---

## Lender-Specific Tone

| Do | Don't |
|----|-------|
| "Projects under review" | "Active projects" |
| "Bankability assessment" | "Score report" |
| "Confidence levels" | "Trust scores" |
| "Risk signals" | "Warnings" |
| "Portfolio risk" | "Overall risk" |
| "View evidence" | "Check documents" |

---

## Lender View Differences

| Element | Grower/Developer | Lender |
|---------|------------------|--------|
| Progress bar | Shown | Hidden |
| Edit actions | Common | None |
| Primary CTA | Action-oriented | Review-oriented |
| Checklist | Task completion | Not used |
| Tone | Encouraging | Neutral/analytical |
