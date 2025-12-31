# Developer Dashboard — v1 Content Pack

**Design Option:** Same components · Higher density · Action-oriented

---

## 1) RoleHeader — Developer

### State A — Early / Exploring

| Element | Content |
|---------|---------|
| **Title** | Developer Dashboard |
| **Status chip label** | Supply coverage incomplete |
| **Status chip tone** | `warning` |
| **Progress value** | 52% |
| **Progress label** | Secure additional verified supply to meet project requirements |
| **Primary action** | Find supply |
| **Secondary link** | How supply scoring works |

### State B — Active / Contracting

| Element | Content |
|---------|---------|
| **Title** | Developer Dashboard |
| **Status chip label** | Supply pipeline active |
| **Status chip tone** | `success` |
| **Progress value** | 86% |
| **Progress label** | Coverage meets initial feasibility requirements |
| **Primary action** | Review shortlisted suppliers |

### State C — Risk Flagged

| Element | Content |
|---------|---------|
| **Title** | Developer Dashboard |
| **Status chip label** | Supply risk detected |
| **Status chip tone** | `risk` |
| **Progress value** | 74% |
| **Progress label** | One or more risks may affect bankability |
| **Primary action** | View risks |

---

## 2) NextStepCard — Developer

### Variant A — Supply Gap

| Element | Content |
|---------|---------|
| **Title** | Key supply gap identified |
| **Body** | Your current supply coverage is below target for projected demand. |
| **Primary CTA** | Search verified suppliers |
| **Checklist item 1** | Base load coverage — ⏳ |
| **Checklist item 2** | Seasonal coverage — ⏳ |
| **Checklist item 3** | Geographic diversity — ⏳ |

### Variant B — Contract Readiness

| Element | Content |
|---------|---------|
| **Title** | Your next best step |
| **Body** | Shortlisted suppliers are ready for contract discussions. |
| **Primary CTA** | Open deal room |
| **Checklist item 1** | Evidence verified — ✅ |
| **Checklist item 2** | Pricing indicative — ✅ |
| **Checklist item 3** | Availability confirmed — ⏳ |

---

## 3) KPI Tiles (StatsGrid · 3 Tiles)

### Tile 1 — Supply Coverage

| Element | Content |
|---------|---------|
| **Label** | Supply Coverage |
| **Value** | 68% |
| **Helper** | Portion of demand backed by verified supply |
| **Action link** | Add supply |

### Tile 2 — Bankable Supply

| Element | Content |
|---------|---------|
| **Label** | Bankable Supply |
| **Value** | 41% |
| **Helper** | Meets lender-ready thresholds |
| **Action link** | Improve bankability |

### Tile 3 — Active Suppliers

| Element | Content |
|---------|---------|
| **Label** | Active Suppliers |
| **Value** | 6 |
| **Helper** | In current evaluation or negotiation |
| **Action link** | View suppliers |

---

## 4) Shortlisted Supply Section

### SectionHeader

| Element | Content |
|---------|---------|
| **Title** | Shortlisted suppliers |
| **Action** | Add supplier |

### ListingSummaryCard — Developer View

| Element | Content |
|---------|---------|
| **Listing name** | Bamboo biomass — NT |
| **Status** | Verified |
| **Score** | Good (76) |
| **Volume** | 120,000 tpa |
| **Delivery window** | Annual |
| **Primary action** | Open profile |
| **Secondary action** | Add to deal room |

### Empty State

| Element | Content |
|---------|---------|
| **Title** | No suppliers shortlisted yet |
| **Description** | Shortlist suppliers to compare risk, pricing, and availability. |
| **CTA** | Browse suppliers |

---

## 5) Risk & Signals Card

| Element | Content |
|---------|---------|
| **Title** | Key risks & signals |
| **Item 1** | Seasonal variability — ⚠️ |
| **Item 2** | Logistics exposure — ⚠️ |
| **Item 3** | Regulatory alignment — ✅ |
| **CTA** | View risk breakdown |

---

## 6) ExplainerCarousel — Developer (3 Panels)

### Panel 1

| Element | Content |
|---------|---------|
| **Title** | How supply coverage is calculated |
| **Body** | Supply coverage measures verified volume against your projected demand requirements. |

### Panel 2

| Element | Content |
|---------|---------|
| **Title** | What lenders look for |
| **Body** | Lenders assess feedstock security, counterparty quality, and supply chain resilience. |

### Panel 3

| Element | Content |
|---------|---------|
| **Title** | How to move from shortlist to contract |
| **Body** | Use the deal room to negotiate terms, verify evidence, and progress to binding agreements. |

---

## Developer Dashboard States to Build

### State 1: Early / Exploring Developer
- RoleHeader: State A (52%, supply gap)
- NextStepCard: Variant A (supply gap)
- KPI Tiles: Lower values, warnings
- Shortlist: 1-2 suppliers or empty
- Risks: Multiple warnings

### State 2: Active / Contracting Developer
- RoleHeader: State B (86%, pipeline active)
- NextStepCard: Variant B (contract ready)
- KPI Tiles: Strong values
- Shortlist: 4-6 suppliers
- Risks: Mostly clear

### State 3: Risk Flagged Developer
- RoleHeader: State C (74%, risk detected)
- NextStepCard: Risk-focused variant
- KPI Tiles: Mixed with risk tone
- Shortlist: Active suppliers
- Risks: Multiple items flagged

---

## Sample Supplier Names (Developer View)

| Name | Feedstock | Volume |
|------|-----------|--------|
| Bamboo biomass — NT | Bamboo | 120,000 tpa |
| Sugarcane bagasse — Mackay | Bagasse | 85,000 tpa |
| Wheat stubble — SA | Wheat stubble | 45,000 tpa |
| Forestry residues — Gippsland | Forestry | 60,000 tpa |
| Cotton gin trash — Moree | Cotton | 25,000 tpa |

---

## Developer-Specific Tone

| Do | Don't |
|----|-------|
| "Supply coverage" | "Feedstock availability" |
| "Bankable supply" | "Verified feedstock" |
| "Open deal room" | "Contact supplier" |
| "Search verified suppliers" | "Browse marketplace" |
| "Coverage meets requirements" | "You're on track" |
