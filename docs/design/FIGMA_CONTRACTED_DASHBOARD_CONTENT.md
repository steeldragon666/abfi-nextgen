# Contracted / Post-Signing Dashboard — v1 Content Pack

**Design Philosophy:** Execution · Monitoring · Assurance

---

## Dashboard Purpose (Core Questions)

This dashboard exists to answer three questions:

| Question | Focus |
|----------|-------|
| **Is the contract being met?** | Delivery compliance |
| **Is confidence being maintained over time?** | Evidence freshness |
| **Are there emerging risks that require action?** | Risk signals |

### What This Dashboard IS

- A shared source of truth
- A monitoring and assurance layer
- A lender-safe oversight surface

### What This Dashboard IS NOT

- A trading screen
- A logistics ERP
- A financial settlement system

---

## Screen Identification

| Property | Value |
|----------|-------|
| **Screen ID** | Screen / Contracted / Overview |
| **Triggered when** | Deal stage = Contracted |
| **Maps to code** | `SupplyAgreements.tsx`, `SupplyChainDashboard.tsx`, `MonitoringJobsScheduler.tsx`, `PlatformHealth.tsx` (signals only) |

---

## 1) PageHeader (Contracted Context)

| Element | Content |
|---------|---------|
| **Title** | Contract overview |
| **Subtitle** | Monitoring delivery, evidence, and ongoing compliance |
| **Primary action (Grower)** | View delivery requirements |
| **Primary action (Developer)** | View performance |
| **Primary action (Lender)** | Download assurance summary |
| **Secondary link** | View signed terms |

---

## 2) Contract Summary Strip (Top Band)

Use a Card (outlined) with horizontal layout. All fields read-only.

| Field | Example Content |
|-------|-----------------|
| **Contract ID** | CTR-2024-0847 |
| **Supplier (Grower)** | GreenGrow Biomass Co |
| **Buyer (Developer)** | NT SAF Holdings |
| **Lender (if applicable)** | Australian Clean Energy Finance |
| **Contract length** | 5 years |
| **Delivery cadence** | Quarterly |
| **Status** | Active |
| **Status tone** | `success` |

*This replaces the need for users to "remember" what deal they're in.*

---

## 3) KPI Tiles — Contract Health (StatsGrid · 3 Tiles)

### Tile 1 — Delivery Status

| Element | Content |
|---------|---------|
| **Label** | Delivery Status |
| **Value** | On track |
| **Helper** | Deliveries meeting agreed schedule |
| **Tone options** | `success` / `warning` / `risk` |

### Tile 2 — Evidence Freshness

| Element | Content |
|---------|---------|
| **Label** | Evidence Freshness |
| **Value** | Up to date |
| **Helper** | Required evidence within validity period |
| **Action (if needed)** | View expiring items |

### Tile 3 — Risk Signals

| Element | Content |
|---------|---------|
| **Label** | Risk Signals |
| **Value** | 1 active |
| **Helper** | Items requiring attention |
| **Action** | View risks |

**Rule:** KPIs are status, not numbers. Avoid "tonnes delivered" unless required later.

---

## 4) Section — Delivery & Commitments

### SectionHeader

| Element | Content |
|---------|---------|
| **Title** | Delivery & commitments |

### A) Delivery Timeline Card

| Element | Content |
|---------|---------|
| **Title** | Delivery schedule |
| **Content** | Simple timeline / list (not a Gantt) |

#### Timeline Rows

| Period | Expected Volume | Status |
|--------|-----------------|--------|
| Q1 2026 | 30,000 tonnes | On track |
| Q2 2026 | 30,000 tonnes | Upcoming |
| Q3 2026 | 30,000 tonnes | Upcoming |
| Q4 2026 | 30,000 tonnes | Upcoming |

| Element | Content |
|---------|---------|
| **CTA (Developer only)** | View detailed schedule |

### B) Performance Notes (Optional)

Use Alert (info) when present:

**Normal State:**
| Element | Content |
|---------|---------|
| **Alert type** | `info` |
| **Message** | No delivery issues recorded. |

**Issue State:**
| Element | Content |
|---------|---------|
| **Alert type** | `warning` |
| **Message** | One delivery window requires review. |

---

## 5) Section — Evidence & Compliance (Ongoing)

### SectionHeader

| Element | Content |
|---------|---------|
| **Title** | Ongoing evidence & compliance |

### EvidenceProgressCard (Contract Mode)

Same component used earlier, with different preset.

| Element | Content |
|---------|---------|
| **Progress label (good)** | All required documents current |
| **Progress label (warning)** | 1 item expiring soon |

#### Checklist (Example)

| Item | Status |
|------|--------|
| Sustainability certificate | ✅ Current |
| Quality testing | ✅ Current |
| Insurance | ⏳ Expires in 30 days |

| Element | Content |
|---------|---------|
| **CTA (Grower)** | Update expiring document |
| **CTA (Developer/Lender)** | View evidence |

### Expiry Warning State

| Element | Content |
|---------|---------|
| **Alert type** | `warning` |
| **Message** | One document will expire within 30 days. |
| **CTA** | Request update |

---

## 6) Section — Monitoring & Signals

### SectionHeader

| Element | Content |
|---------|---------|
| **Title** | Monitoring & signals |

### Risk Signals Card

| Element | Content |
|---------|---------|
| **Title** | Active monitoring signals |

#### Items (max 3 visible)

| Signal | Status |
|--------|--------|
| Weather variability | ⚠️ |
| Supply concentration | ⚠️ |
| Compliance alignment | ✅ |

| Element | Content |
|---------|---------|
| **CTA** | View signal details |

*Signals are interpretive, not raw data.*

### Monitoring Jobs Summary (Optional)

| Element | Content |
|---------|---------|
| **Sampling cadence** | Monthly |
| **Last check date** | 15 Dec 2024 |
| **Next scheduled check** | 15 Jan 2025 |

*No controls exposed to growers unless required.*

---

## 7) Section — Activity & Record

### SectionHeader

| Element | Content |
|---------|---------|
| **Title** | Contract activity |

### Activity Feed (Read-Only)

Items include:
- Evidence updates
- Status changes
- Reviews completed
- Notes added

#### Activity Entry Format

| Field | Description |
|-------|-------------|
| **Actor** | Who performed the action |
| **Date/time** | When it occurred |
| **Action** | What was done |

#### Example Activity Items

| Timestamp | Actor | Action |
|-----------|-------|--------|
| 2 days ago | GreenGrow Biomass Co | Uploaded updated insurance certificate |
| 1 week ago | System | Q1 2026 delivery marked on track |
| 2 weeks ago | NT SAF Holdings | Added performance note |
| 1 month ago | System | Monitoring check completed |
| 3 months ago | System | Contract signed and activated |

*This supports auditability without surfacing raw logs.*

---

## 8) Tabs (Optional, Recommended for Scale)

If the contract grows complex, introduce tabs:

| Tab | Purpose |
|-----|---------|
| **Overview** | Default view (this spec) |
| **Evidence** | All documents and certifications |
| **Monitoring** | Signals and scheduled checks |
| **Activity** | Full audit trail |
| **Terms** | Read-only signed terms |

*Tabs use underline style only.*

---

## 9) Role-Based Behaviour (Critical)

### Grower

| Capability | Access |
|------------|--------|
| View obligations | ✅ Can |
| Upload/update evidence | ✅ Can |
| See delivery expectations | ✅ Can |
| Modify terms | ❌ Cannot |
| See sensitive pricing | ❌ Cannot |

| Element | Content |
|---------|---------|
| **Primary CTA** | Update required document |

### Developer

| Capability | Access |
|------------|--------|
| Monitor performance | ✅ Can |
| Flag issues | ✅ Can |
| Request updates | ✅ Can |
| Edit signed terms | ❌ Cannot |

| Element | Content |
|---------|---------|
| **Primary CTA** | View performance details |

### Lender

| Capability | Access |
|------------|--------|
| View assurance | ✅ Can |
| Download summaries | ✅ Can |
| Monitor risk drift | ✅ Can |
| Interact operationally | ❌ Cannot |

| Element | Content |
|---------|---------|
| **Primary CTA** | Download assurance summary |

---

## 10) Empty & Edge States

### No Monitoring Enabled

| Element | Content |
|---------|---------|
| **Title** | Monitoring not enabled |
| **Description** | This contract does not include ongoing monitoring. |

### Compliance Issue Detected

| Element | Content |
|---------|---------|
| **Alert type** | `risk` |
| **Message** | A compliance issue requires attention. |
| **CTA** | View issue |

### Contract Completed (Future State)

| Element | Content |
|---------|---------|
| **Status** | Completed |
| **Message** | This contract has concluded. Records are retained for audit purposes. |
| **CTA** | View archived record |

---

## 11) Contract Dashboard States to Build

### State 1: Healthy Contract

- PageHeader: Normal
- Contract Strip: Active (success)
- KPI Tiles: All green (On track, Up to date, 0 risks)
- Delivery: All on track
- Evidence: All current
- Signals: All clear

### State 2: Attention Required

- PageHeader: Normal
- Contract Strip: Active (success)
- KPI Tiles: Mixed (On track, 1 expiring, 2 risks)
- Delivery: On track
- Evidence: 1 item expiring warning
- Signals: 2 warnings

### State 3: Issue Detected

- PageHeader: Normal with alert banner
- Contract Strip: Active (but attention)
- KPI Tiles: Warning state (Delayed, Issues, 3 risks)
- Delivery: One delayed
- Evidence: Expired item
- Signals: Multiple warnings

### State 4: Contract Completed

- PageHeader: Completed
- Contract Strip: Completed (neutral)
- All sections: Read-only archive mode
- CTA: View archived record

---

## 12) Strategic Value

This dashboard:

| Stakeholder | Value |
|-------------|-------|
| **Lenders** | Confidence post-financial close |
| **Developers** | Assurance without micromanagement |
| **Growers** | Clarity without pressure |
| **Platform** | Long-term stickiness |

ABFI becomes: **The system that stays relevant after the contract is signed.**

---

## 13) Complete Platform Lifecycle

| Stage | Dashboard |
|-------|-----------|
| Onboarding → Listing | Grower Dashboard |
| Supply → Deal | Developer Dashboard |
| Bankability → Oversight | Lender Dashboard |
| Evaluation → Agreement | Deal Room |
| Execution → Assurance | **Contracted Dashboard** |

*This is a complete lifecycle platform, not a feature set.*

---

## 14) Contracted Dashboard-Specific Tone

| Do | Don't |
|----|-------|
| "Contract overview" | "Deal summary" |
| "Delivery status" | "Tonnes delivered" |
| "Evidence freshness" | "Document status" |
| "On track" | "100% compliant" |
| "Requires attention" | "Failed" |
| "Update expiring document" | "Upload missing file" |
| "View signed terms" | "Contract details" |
| "Assurance summary" | "Compliance report" |

---

## 15) Quick Copy Reference

### Button Labels

- View delivery requirements
- View performance
- Download assurance summary
- View signed terms
- View detailed schedule
- Update expiring document
- View evidence
- Request update
- View signal details
- View issue
- View archived record

### Status Labels

- Active
- On track
- Up to date
- Upcoming
- Expiring
- Requires attention
- Completed

### Helper Text Patterns

- "Monitoring delivery, evidence, and ongoing compliance"
- "Deliveries meeting agreed schedule"
- "Required evidence within validity period"
- "Items requiring attention"
- "All required documents current"
- "This contract does not include ongoing monitoring"
- "Records are retained for audit purposes"

---

## 16) Implementation Checklist

- [ ] Create PageHeader with role-based primary actions
- [ ] Create Contract Summary Strip (horizontal card)
- [ ] Create KPI Tiles with status values (not numbers)
- [ ] Create Delivery Timeline Card (list format)
- [ ] Create EvidenceProgressCard (contract mode preset)
- [ ] Create Risk Signals Card
- [ ] Create Activity Feed (read-only)
- [ ] Implement role-based view differences
- [ ] Create all empty/edge states
- [ ] Build tabs structure (if needed)
- [ ] Test status transitions
- [ ] Verify lender read-only access

---

## 17) Component Mapping

| Dashboard Component | Base Component |
|--------------------|----------------|
| Contract Summary Strip | Card (outlined, horizontal) |
| KPI Tiles | StatsGrid / StatTile |
| Delivery Timeline | Card with list items |
| EvidenceProgressCard | Same as Deal Room |
| Risk Signals Card | Card with list items |
| Activity Feed | Same as Deal Room |
| Alert states | Alert component |

