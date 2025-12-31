# ABFI Platform — Full Design Brief

**Version:** 1.0 · Institutional Infrastructure Edition

---

## 1. Platform Mission (Non-Negotiable)

ABFI exists to make bioenergy feedstock projects:

| Objective | Meaning |
|-----------|---------|
| **Discoverable** | Can be found by relevant parties |
| **Comparable** | Can be assessed against alternatives |
| **Bankable** | Can pass lender scrutiny |
| **Monitorable** | Can be tracked over time |
| **Defensible under audit** | Can withstand regulatory review |

### What ABFI Is NOT

| Not This | Why |
|----------|-----|
| A marketplace in the consumer sense | Not optimising for transaction volume |
| A trading platform | Not facilitating real-time trades |
| An ERP | Not managing operations |
| A consultancy | Not providing bespoke advice |

> **ABFI is infrastructure software.**

---

## 2. Core Design Principles

These apply to every screen, module, and export.

### 2.1 Clarity Over Density

| Rule | Implementation |
|------|----------------|
| One primary action per screen | Single dominant CTA |
| Max 3 metrics visible at once | Unless in specialist views |
| Progressive disclosure always preferred | Details behind interaction |

### 2.2 Evidence First

| Rule | Implementation |
|------|----------------|
| Any score must be explainable | Drivers visible |
| Any status must be explainable | Source traceable |
| Any signal must be explainable | Evidence accessible |
| Evidence accessible within 1 interaction | No deep navigation |

### 2.3 Role-Appropriate Complexity

| Role | Sees |
|------|------|
| **Growers** | Tasks |
| **Developers** | Coverage & readiness |
| **Lenders** | Risk & assurance |
| **Government** | Public interest & compliance |

### 2.4 Print & Audit Safe

Every critical output must survive:

| Test | Requirement |
|------|-------------|
| PDF export | Clean rendering |
| Black & white printing | No information loss |
| FOI requests | Legally defensible |

---

## 3. User Roles (System-Wide)

### 3.1 Grower / Producer

**Primary objective:**
> Become visible, credible, and contract-ready with minimal friction.

| Design Bias | Implementation |
|-------------|----------------|
| Plain English | No jargon |
| Checklist-driven | Clear task lists |
| Time-to-complete surfaced | "Takes about 3 minutes" |

### 3.2 Developer / Buyer

**Primary objective:**
> Assemble sufficient verified supply to reach financial close.

| Design Bias | Implementation |
|-------------|----------------|
| Coverage metrics | % of demand covered |
| Comparability | Side-by-side assessment |
| Risk surfacing | Flags and signals visible |

### 3.3 Lender / Financier

**Primary objective:**
> Assess, approve, and monitor supply-side risk.

| Design Bias | Implementation |
|-------------|----------------|
| Assurance | Confidence levels |
| Change detection | "No change" explicit |
| Auditability | Full trail |

### 3.4 Administrator / Assessor (ABFI)

**Primary objective:**
> Verify, monitor, and govern the system.

| Design Bias | Implementation |
|-------------|----------------|
| Traceability | Every action logged |
| Workflow clarity | Clear queues |
| Escalation visibility | Flags surfaced |

---

## 4. Platform Module Map (All Modules)

This is the complete functional inventory.

### MODULE A — Identity & Access

**Components:**
- Role selection
- Permissions engine
- Visibility rules

**Design Requirements:**

| Requirement | Implementation |
|-------------|----------------|
| Role visible at all times | Header/sidebar indicator |
| Role-based CTA changes | Context-aware buttons |
| No cross-role leakage | Strict permission boundaries |

---

### MODULE B — Onboarding & Registration

**Sub-modules:**
- Grower registration
- Developer registration
- Lender registration

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Step-based | Clear progression |
| Save & resume | No lost work |
| Progress visible | Percentage shown |
| No penalties for partial completion | Encouraging tone |

---

### MODULE C — Grower Workspace

**Includes:**
- Grower Dashboard
- Property details
- Production profile
- Feedstock listings
- Evidence uploads
- Inquiries

**UX Mandate:**
> Always answer: "What should I do next?"

---

### MODULE D — Feedstock Registry

**Includes:**
- Feedstock create/edit
- Feedstock detail
- Public supplier profiles
- Map-based discovery

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Cards first, tables second | Visual browsing |
| Max 2 attributes surfaced by default | Progressive disclosure |
| Full detail behind tabs | Organised depth |

---

### MODULE E — Evidence & Verification

**Includes:**
- Certificate upload
- Quality testing
- Evidence vault
- Verification status

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Status must be explicit | Clear indicators |
| Expiry dates surfaced early | Proactive warnings |
| No silent failures | Error states visible |

---

### MODULE F — Scoring & Intelligence (RSIE)

**Includes:**
- Bankability scoring
- Confidence levels
- Risk drivers
- Concentration analysis
- Carbon intensity analysis

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Scores must have band | Good / Medium / Risk |
| Scores must have meaning | Plain English |
| Scores must have drivers | Explainable factors |
| No unexplained numbers | Context required |

---

### MODULE G — Marketplace & Demand Signals

**Includes:**
- Browse supply
- Demand signal creation
- Inquiry workflows
- Futures / offtake views

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Intent clarity | Purpose visible |
| No pressure language | Respectful tone |
| Traceable interactions | Logged exchanges |

---

### MODULE H — Deal Room

**Includes:**
- Deal room creation
- Participant management
- Evidence sharing
- Term discussion
- Activity tracking

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Clear responsibility | Role indicators |
| One shared truth | Single source |
| No hidden state | Full visibility |

---

### MODULE I — Contracted Execution

**Includes:**
- Contract overview
- Delivery expectations
- Ongoing compliance
- Monitoring signals
- Activity log

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Read-only bias | Observation mode |
| Status > metrics | Qualitative first |
| Early warning emphasis | Proactive alerts |

---

### MODULE J — Monitoring & Signals

**Includes:**
- Monitoring jobs
- Signal detection
- Risk escalation
- Change logs

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Conservative alerts | No false positives |
| Explicit "no change" states | Verbatim confirmation |
| No predictive claims | Historical only |

---

### MODULE K — Assurance Outputs

**Includes:**
- Assurance Pack (Institutional)
- Government reporting (ARENA / CEFC)
- Covenant monitoring summaries
- Export engine

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Immutable snapshots | Frozen at export |
| Versioned | Schema tracking |
| Timestamped | Generation date |
| Legally safe language | Approved terms only |

---

### MODULE L — Administration & Governance

**Includes:**
- Admin dashboards
- User management
- Audit logs
- Verification workflows
- Platform health

**Design Rules:**

| Rule | Implementation |
|------|----------------|
| Internal density allowed | Power user interface |
| Full traceability | Complete audit trail |
| No aesthetic optimisation over clarity | Function over form |

---

## 5. Design System Structure (Figma)

### Pages

| Page | Content |
|------|---------|
| Cover & principles | Mission, values, ownership |
| Tokens & variables | Colors, typography, spacing |
| Foundations | Grid, breakpoints, motion |
| UI components | Buttons, inputs, cards, etc. |
| Domain components | RoleHeader, ScoreCard, etc. |
| Patterns | Dashboard, registration, detail |
| Templates | Role-based page templates |
| Screens (role-based) | Grower, Developer, Lender, Admin |
| Exports | Assurance / Gov / Covenant |

### Naming Conventions

| Prefix | Usage |
|--------|-------|
| `UI/*` | Base UI components |
| `Domain/*` | ABFI-specific components |
| `Pattern/*` | Reusable layouts |
| `Template/*` | Page templates |
| `Export/*` | Document exports |

---

## 6. State Management (Mandatory)

Every module must explicitly design for:

| State | Description |
|-------|-------------|
| **Empty** | No data present |
| **Loading** | Data being fetched |
| **Partial** | Incomplete data |
| **Error** | Something failed |
| **Success** | Action completed |
| **Archived** | Historical record |

> **No implicit states.**

---

## 7. Accessibility & Compliance

### Required

| Requirement | Standard |
|-------------|----------|
| Contrast | WCAG AA |
| Navigation | Keyboard accessible |
| Labels | Screen-reader safe |

### Export Compliance

| Test | Requirement |
|------|-------------|
| Print safe | Clean on paper |
| Grayscale safe | No information loss |
| FOI safe | Legally defensible |

---

## 8. Copy & Language Governance

### Allowed Language

| Phrase | Context |
|--------|---------|
| "Indicates" | Describing data |
| "Based on available evidence" | Qualifying statements |
| "As of reporting date" | Time-bound claims |
| "Monitoring suggests" | Signal descriptions |

### Prohibited Language

| Phrase | Reason |
|--------|--------|
| "Guarantees" | Legal liability |
| "Ensures" | Overpromising |
| "Optimal" | Subjective claim |
| "Best-in-class" | Marketing speak |

---

## 9. Technical Handoff Requirements

### Figma → Dev

| Requirement | Implementation |
|-------------|----------------|
| Component props named identically | 1:1 mapping |
| Variants documented | All states covered |
| Visibility rules annotated | Permission notes |

### Dev → Data

| Requirement | Implementation |
|-------------|----------------|
| Snapshot-based exports | Immutable records |
| Schema versioning | Structure tracking |
| Hashing & timestamps | Integrity verification |

---

## 10. Success Criteria

The platform is successful if:

| Stakeholder | Success Measure |
|-------------|-----------------|
| **Grower** | Can onboard without assistance |
| **Developer** | Can reach financial close faster |
| **Lender** | Can approve without bespoke memos |
| **Government reviewer** | Can read without clarification |
| **Auditor** | Can reconstruct decisions |

---

## 11. What This Brief Enables

This brief allows ABFI to:

| Capability | Benefit |
|------------|---------|
| Scale without UI entropy | Consistent growth |
| Withstand regulatory scrutiny | Compliance confidence |
| Become embedded in finance workflows | Institutional adoption |
| Avoid redesign cycles | Long-term stability |
| Behave like infrastructure, not a startup | Market positioning |

---

## Module-to-Documentation Mapping

| Module | Documentation File |
|--------|-------------------|
| A — Identity & Access | Component contracts |
| B — Onboarding & Registration | Grower Dashboard content |
| C — Grower Workspace | Grower Dashboard spec & content |
| D — Feedstock Registry | Component specs |
| E — Evidence & Verification | Component specs |
| F — Scoring & Intelligence | Component contracts |
| G — Marketplace & Demand Signals | Developer Dashboard content |
| H — Deal Room | Deal Room Dashboard content |
| I — Contracted Execution | Contracted Dashboard content |
| J — Monitoring & Signals | Contracted Dashboard content |
| K — Assurance Outputs | Assurance Pack spec, Style, Variants |
| L — Administration & Governance | (Admin spec pending) |

---

## Related Documentation Files

| File | Purpose |
|------|---------|
| `FIGMA_REDESIGN_TODO.md` | Master implementation checklist |
| `FIGMA_REDESIGN_README.md` | Overview & component mapping |
| `FIGMA_COMPONENT_CONTRACTS.md` | Figma ↔ React prop contracts |
| `FIGMA_GROWER_DASHBOARD_SPEC.md` | Grower layout specification |
| `FIGMA_GROWER_COMPONENTS_SPEC.md` | 8 core component specs |
| `FIGMA_GROWER_DASHBOARD_CONTENT.md` | Grower Dashboard content |
| `FIGMA_DEVELOPER_DASHBOARD_CONTENT.md` | Developer Dashboard content |
| `FIGMA_LENDER_DASHBOARD_CONTENT.md` | Lender Dashboard content |
| `FIGMA_DEALROOM_DASHBOARD_CONTENT.md` | Deal Room content |
| `FIGMA_CONTRACTED_DASHBOARD_CONTENT.md` | Contracted Dashboard content |
| `FIGMA_ASSURANCE_PACK_SPEC.md` | Export specification |
| `FIGMA_ASSURANCE_PACK_STYLE.md` | Style System A |
| `FIGMA_EXPORT_VARIANTS_SPEC.md` | Gov/Covenant/Schema specs |
| `FIGMA_ARENA_CEFC_TEMPLATE_MAPPING.md` | ARENA/CEFC mapping |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-05 | Initial institutional infrastructure edition |

