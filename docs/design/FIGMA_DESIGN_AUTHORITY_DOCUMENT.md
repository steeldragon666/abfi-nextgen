# ABFI Design Authority Document (DAD)

**Version:** 1.0 · Institutional Infrastructure Platform

| Property | Value |
|----------|-------|
| **Status** | Active |
| **Applies to** | All ABFI digital products, exports, and interfaces |
| **Effective date** | 2025-05-23 |
| **Supersedes** | Ad hoc design decisions |
| **Baseline commit** | `04f91fc` |
| **Git tag** | `v1.0-design-authority` |

---

## 1. Purpose of This Document

The ABFI Design Authority Document exists to:

| Purpose | Description |
|---------|-------------|
| **Establish authority** | Single decision-making authority for UX/UI and information design |
| **Prevent variation** | No uncontrolled changes across modules, roles, and teams |
| **Ensure compliance** | Finance-sector expectations, government reporting norms, audit standards |
| **Enable delegation** | Safe handoff of design and development work |

### Binding On

This document is binding on:

- Designers
- Engineers
- Product managers
- External agencies
- Contractors

---

## 2. Design Authority Scope

### The Design Authority Governs

| Domain | Coverage |
|--------|----------|
| Visual design | All UI elements |
| Information architecture | Structure and navigation |
| Component usage | Approved components only |
| Role-based UX behaviour | Presets and variations |
| Export and reporting outputs | All generated documents |
| Language and tone | Approved terminology |
| Accessibility and compliance | Standards adherence |

### Explicitly Covers

| Surface | Included |
|---------|----------|
| Web application UI | ✅ |
| Generated documents (PDF/DOCX) | ✅ |
| Future APIs (presentation-layer data) | ✅ |
| White-labelled or partner-facing variants | ✅ |

---

## 3. Design Authority Ownership

### Design Authority Holder

> ABFI Platform Owner / Delegate

### Decision Rights

The Design Authority Holder has final approval over:

| Decision | Authority |
|----------|-----------|
| Component creation or deprecation | Required |
| Visual or structural changes | Required |
| Role-based UX divergence | Required |
| Export format changes | Required |
| Language and terminology changes | Required |

### Delegation Rule

> **Execution may be delegated, authority may not.**

---

## 4. Non-Negotiable Design Tenets

These principles override all other considerations.

### 4.1 Infrastructure, Not Product

**ABFI behaves like:**

| Characteristic | Description |
|----------------|-------------|
| A registry | Records and tracks |
| A verification system | Confirms and validates |
| A monitoring layer | Observes and reports |

**ABFI must never resemble:**

| Anti-pattern | Why |
|--------------|-----|
| A consumer marketplace | Wrong positioning |
| A growth SaaS | Wrong incentives |
| A promotional platform | Wrong tone |

---

### 4.2 Evidence Supremacy

Any surfaced signal, score, or status must be:

| Requirement | Description |
|-------------|-------------|
| **Derivable** | From stored data |
| **Explainable** | In plain English |
| **Auditable** | Retrospectively |

> **No decorative metrics are permitted.**

---

### 4.3 Role-Appropriate Disclosure

Each role sees:

| Principle | Implementation |
|-----------|----------------|
| Only what they need | Minimal viable context |
| At actionable complexity | Matched to capability |

> **Cross-role leakage is prohibited.**

---

### 4.4 Audit Survivability

Every critical output must survive:

| Test | Requirement |
|------|-------------|
| PDF export | Clean rendering |
| Grayscale printing | No information loss |
| FOI request | Legally defensible |
| Legal discovery | Traceable and complete |

> **If it cannot survive these tests, it must not be shipped.**

---

## 5. Design System Governance

### 5.1 Component Authority

> Only components defined in the ABFI Component System may be used.

**New components require:**

| Requirement | Description |
|-------------|-------------|
| Clear justification | Why existing components are insufficient |
| Mapping to existing pattern | How it fits the system |
| Approval by Design Authority Holder | Formal sign-off |
| Documentation of props and states | Complete specification |

> **Ad hoc UI construction is prohibited.**

---

### 5.2 Variants vs New Components

**Rule:**
> If a behaviour can be achieved with a variant, a new component is not allowed.

---

### 5.3 Role Presets

Components may change:

| Allowed | Example |
|---------|---------|
| Content | Different copy |
| Density | More/less information |
| Emphasis | Different highlighting |

Components may NOT change:

| Prohibited | Reason |
|------------|--------|
| Structure | Breaks consistency |
| Meaning | Creates confusion |
| Affordances | Violates expectations |

**Example:**
- Grower dashboard = checklist-driven
- Lender dashboard = assurance-driven
- Same components, different presets

---

## 6. Information Architecture Authority

### 6.1 Module Boundaries

> Modules defined in the Platform Design Brief are authoritative.

**Cross-module coupling must be:**

| Requirement | Description |
|-------------|-------------|
| Explicit | Documented in code |
| Documented | In architecture docs |
| Approved | By Design Authority Holder |

---

### 6.2 Navigation Rules

| Rule | Specification |
|------|---------------|
| One primary navigation paradigm per role | No mixed models |
| No nested navigation beyond 2 levels | Flat hierarchy |
| No hidden "expert" paths | Except Admin views |

---

## 7. Language & Terminology Governance

### 7.1 Approved Language

**Permitted verbs and phrases:**

| Phrase | Usage |
|--------|-------|
| "indicates" | Describing data |
| "based on available evidence" | Qualifying statements |
| "monitoring suggests" | Signal descriptions |
| "as of reporting date" | Time-bound claims |

---

### 7.2 Prohibited Language

**Disallowed in all UI and exports:**

| Phrase | Reason |
|--------|--------|
| "guarantees" | Legal liability |
| "ensures" | Overpromising |
| "best-in-class" | Marketing speak |
| "optimised" | Subjective claim |
| "industry-leading" | Unverifiable |

> **This applies to marketing pages as well.**

---

### 7.3 Terminology Lock

The following terms are locked and may not be renamed without authority approval:

| Term | Status |
|------|--------|
| Bankability | Locked |
| Confidence | Locked |
| Evidence | Locked |
| Monitoring | Locked |
| Assurance | Locked |
| Deal Room | Locked |

---

## 8. Export & Reporting Governance

### 8.1 Export Types

**Only the following exports are authorised:**

| Export | Purpose |
|--------|---------|
| Assurance Pack (Institutional) | Lender-grade summary |
| Government Reporting Variant | ARENA/CEFC/NRF compliance |
| Covenant Monitoring Summary | Periodic risk updates |

**Any new export requires:**

| Requirement | Owner |
|-------------|-------|
| Documented purpose | Product |
| Legal review | Legal |
| Design Authority approval | DAH |

---

### 8.2 Export Rules

| Rule | Implementation |
|------|----------------|
| Snapshot-based | Frozen at generation |
| Immutable | Cannot be modified |
| Versioned | Schema tracking |
| Timestamped | Generation date |
| Hashable | Integrity verification |

> **Live or dynamic exports are prohibited.**

---

## 9. Accessibility & Compliance Authority

### 9.1 Accessibility

**All UI must meet:**

| Standard | Requirement |
|----------|-------------|
| WCAG 2.1 AA | Contrast, sizing |
| Keyboard navigation | Full access |
| Screen-reader compatibility | Proper labels |

> Accessibility exceptions require documented approval.

---

### 9.2 Regulatory Sensitivity

**Design must account for:**

| Scrutiny Level | Context |
|----------------|---------|
| FOI exposure | Public records requests |
| ANAO review | Auditor-General oversight |
| Senate Estimates | Parliamentary questioning |
| Credit committee scrutiny | Lender review |

> **If a screen or export cannot be defended verbally under questioning, it must be revised.**

---

## 10. Change Control Process

### 10.1 Change Categories

| Change Type | Approval Required |
|-------------|-------------------|
| Visual refinement | Design Lead |
| New variant | Design Authority Holder |
| New component | Design Authority Holder |
| New module | Design Authority Holder + Exec |
| Terminology change | Design Authority Holder |
| Export change | Design Authority Holder + Legal |

---

### 10.2 Design Drift Detection

**The Design Authority Holder may:**

| Action | Purpose |
|--------|---------|
| Block releases | Prevent non-compliant code |
| Require refactoring | Fix violations |
| Mandate re-alignment | Restore system standards |

> **This power is explicit and intentional.**

---

## 11. Enforcement

This document is enforceable by:

| Mechanism | Implementation |
|-----------|----------------|
| Design reviews | Pre-merge evaluation |
| Pull request checks | Automated and manual |
| Delivery acceptance criteria | Sign-off requirements |
| Contractual clauses with vendors | Legal binding |

> **Non-compliance constitutes a delivery defect.**

---

## 12. Review & Versioning

| Process | Frequency |
|---------|-----------|
| Review | Every 6–12 months |
| Update | Via formal version increment only |
| Archive | Retained indefinitely |

---

## 13. Final Statement of Authority

This Design Authority Document establishes ABFI as a governed, defensible digital system suitable for:

| Context | Readiness |
|---------|-----------|
| Institutional capital | ✅ |
| Public funding interfaces | ✅ |
| Long-term infrastructure operation | ✅ |

> **All contributors are bound by this authority.**

---

## What This Enables (Strategic Summary)

| Capability | Benefit |
|------------|---------|
| Locked design system | No entropy |
| Governed UX architecture | Consistent experience |
| Defensible audit position | Regulatory confidence |
| Safe team scaling | Delegation without risk |

> **Most platforms never reach this level of control.**

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FIGMA_PLATFORM_DESIGN_BRIEF.md` | Governed by this DAD |
| `FIGMA_REDESIGN_TODO.md` | Implementation checklist |
| `FIGMA_COMPONENT_CONTRACTS.md` | Component specifications |
| All content packs | Content governed by this DAD |
| All export specs | Export rules per Section 8 |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-05 | Initial governance framework |

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Design Authority Holder | | | |
| Platform Owner | | | |
| Legal Review | | | |

