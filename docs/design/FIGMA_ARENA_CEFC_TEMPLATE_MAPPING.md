# ARENA / CEFC Reporting Template Mapping

**Context:** Australia · Public Finance · Infrastructure Tone

---

## Positioning Differences (Critical)

| Item | ARENA | CEFC |
|------|-------|------|
| **Primary lens** | Public benefit, innovation, risk reduction | Credit quality, risk management, capital protection |
| **Language sensitivity** | Very high | High |
| **Appetite for metrics** | Moderate | Higher |
| **Appetite for judgement** | Low | Very low |
| **Tolerance for uncertainty** | Explicitly acknowledged | Must be managed |

### ABFI Rule

> Never change the data. Only change the framing.

---

# Part 1 — ARENA Template Mapping

## Target Audience

| Role | Context |
|------|---------|
| Program managers | Day-to-day oversight |
| Technical assessors | Evaluation |
| Policy officers | Compliance |
| Ministerial briefings | Occasional |

> Tone must align with Australian Renewable Energy Agency guidance documents.

---

## ARENA Page Structure (Mapped to ABFI)

### Page 1 — Cover Page

#### ARENA-Compliant Title

```
Feedstock Supply Assurance Summary
(Prepared for ARENA reporting purposes)
```

#### ABFI Fields Mapped

| ARENA Element | ABFI Source |
|---------------|-------------|
| Project name | `project.name` |
| Funding round | Manual metadata |
| Reporting period | `generated_at` |
| Status | `contract.status` |

#### Explicit Exclusion

> Commercial pricing and volumes excluded

---

### Page 2 — Project Context & Public Purpose

#### ARENA Heading

```
Project purpose and public benefit
```

#### Derived from ABFI

| Content | Source |
|---------|--------|
| Project description | Static project metadata |
| Feedstock role | Contract snapshot |

#### Approved Language

> The feedstock supply under review supports the delivery of renewable energy outcomes aligned with program objectives.

#### Avoid

| Word | Reason |
|------|--------|
| "Critical" | Too emphatic |
| "Guaranteed" | Liability risk |
| "Transformational" | Marketing tone |

---

### Page 3 — Feedstock Supply Overview

#### ARENA Heading

```
Feedstock supply arrangements
```

#### Table Fields

| ARENA Field | ABFI Source |
|-------------|-------------|
| Feedstock type | `contract.feedstock_type` |
| Region | `contract.region` |
| Contract status | `contract.status` |
| Delivery cadence | `contract.delivery_cadence` |
| Monitoring enabled | `contract.monitoring_enabled` |

#### Explicit Omission

- Volumes
- Prices
- Counterparty commercial terms

---

### Page 4 — Risk Identification & Mitigation

#### ARENA Heading

```
Key risks and mitigation measures
```

#### Mapped from ABFI

| Content | Source |
|---------|--------|
| Risk signals | `signals[]` |
| Risk drivers | `assurance.drivers_risk` |

#### Required Format

| Element | Length |
|---------|--------|
| Risk | 1 line |
| Mitigation | 1 line |
| Status | Monitoring / Addressed |

#### Example

```
Seasonal variability — Mitigated through diversified supply sourcing — Monitoring ongoing
```

---

### Page 5 — Compliance & Governance

#### ARENA Heading

```
Compliance and governance arrangements
```

#### Mapped from ABFI

| Content | Source |
|---------|--------|
| Evidence summary | `evidence[]` |
| Verification status | Evidence status fields |

#### Approved Statement

> All reviewed documentation aligns with current regulatory and program requirements as of the reporting date.

---

### Page 6 — Monitoring & Oversight

#### ARENA Heading

```
Ongoing monitoring and oversight
```

#### Mapped from ABFI

| Content | Source |
|---------|--------|
| Monitoring enabled | `contract.monitoring_enabled` |
| Cadence | `contract.monitoring_cadence` |
| Escalation rules | Static template text |

#### Key ARENA Phrase (Required)

> Ongoing monitoring supports early identification of material changes.

---

### Page 7 — Methodology & Disclaimer

#### Mandatory ARENA-Safe Language

> This summary is based on information available at the time of reporting and does not constitute a guarantee of future performance.

---

## ARENA Red Flags (Do Not Trip These)

| Red Flag | Why |
|----------|-----|
| ❌ Claims of certainty | Government cannot endorse predictions |
| ❌ Predictive language | FOI and audit risk |
| ❌ Commercial optimisation claims | Not ARENA's mandate |
| ❌ Advocacy tone | ARENA is a funder, not promoter |

---

# Part 2 — CEFC Template Mapping

## Target Audience

| Role | Context |
|------|---------|
| Credit committee | Decision-making |
| Risk team | Assessment |
| Portfolio monitoring | Ongoing oversight |
| External auditors | Compliance verification |

> Tone must align with Clean Energy Finance Corporation credit memoranda.

---

## CEFC Page Structure (Mapped to ABFI)

### Page 1 — Cover

#### CEFC-Compliant Title

```
Feedstock Supply Assurance — Credit Monitoring Summary
```

#### Explicit Statement (Required)

> This document supports credit assessment and monitoring. It does not replace CEFC due diligence.

---

### Page 2 — Transaction Context

#### CEFC Heading

```
Transaction overview
```

#### Mapped Fields

| Content | Source |
|---------|--------|
| Contract status | `contract.status` |
| Counterparties | Roles only (no marketing names if sensitive) |
| Monitoring enabled | `contract.monitoring_enabled` |

#### Tone

> Dry, factual, no narrative flourish.

---

### Page 3 — Supply Assurance Assessment

#### CEFC Heading

```
Supply assurance assessment
```

#### Mapped from ABFI

| Content | Source |
|---------|--------|
| Assurance level | `assurance.level` |
| Confidence level | `assurance.confidence` |
| Positive drivers | `assurance.drivers_positive` |
| Risk drivers | `assurance.drivers_risk` |

#### Required Format

| Element | Content |
|---------|---------|
| Assessment | Level |
| Rationale | Bullet points |
| Status | Current state |

#### Example

```
Assessment: Good
Rationale:
• Verified production profile
• Evidence completeness meets threshold
• Monitoring enabled and active
```

---

### Page 4 — Covenant & Risk Monitoring

#### CEFC Heading

```
Covenant and risk monitoring summary
```

#### Mapped From

Automated Covenant Monitoring Summary

#### Table Format

| Area | Status | Change |
|------|--------|--------|
| Supply continuity | Pass | No change |
| Evidence validity | Attention | New |
| Compliance alignment | Pass | No change |
| Delivery performance | Pass | No change |

#### CEFC Preference

> Explicit "No change" rows are mandatory.

---

### Page 5 — Evidence & Verification

#### CEFC Heading

```
Evidence verification status
```

#### Mapped From

`evidence[]` array

#### Required Phrasing

> Evidence reviewed and verified where applicable.

---

### Page 6 — Change Detection

#### CEFC Heading

```
Changes since last reporting period
```

#### Rule

If no changes:

> No material changes detected.

**This sentence must appear verbatim when true.**

---

### Page 7 — Disclaimer & Limitations

#### CEFC-Safe Disclaimer

> This summary reflects monitoring outputs and does not constitute a representation or warranty.

---

## CEFC Red Flags (Do Not Trip These)

| Red Flag | Why |
|----------|-----|
| ❌ Marketing tone | Credit documents are not sales material |
| ❌ Forward-looking language | Creates liability |
| ❌ Optimistic adjectives | Inappropriate for credit assessment |
| ❌ Visual flair | Credit memos are text-heavy by design |

---

# Part 3 — Implementation Matrix (ABFI → Export)

## Terminology Mapping

| ABFI Object | ARENA Term | CEFC Term |
|-------------|------------|-----------|
| Assurance score | "Supply assurance level" | "Assessment" |
| Confidence | "Confidence level" | "Assessment confidence" |
| Signals | "Risks & mitigations" | "Risk indicators" |
| Monitoring | "Oversight arrangements" | "Credit monitoring" |
| Activity log | Omitted | Summarised |
| Pricing | Omitted | Optional (restricted) |

## Content Inclusion Matrix

| Section | ARENA | CEFC |
|---------|-------|------|
| Cover page | ✅ | ✅ |
| Project context | ✅ (Public benefit focus) | ✅ (Transaction focus) |
| Supply overview | ✅ (No volumes) | ✅ (Volumes optional) |
| Risk identification | ✅ (With mitigations) | ✅ (Indicators only) |
| Compliance | ✅ | ✅ |
| Monitoring | ✅ | ✅ |
| Covenant status | ❌ | ✅ |
| Change detection | ❌ | ✅ |
| Activity log | ❌ | ✅ (Summarised) |
| Methodology | ✅ | ✅ |
| Disclaimer | ✅ (ARENA version) | ✅ (CEFC version) |

---

# Part 4 — Figma & Engineering Notes

## Figma Implementation

### Create Two Export Variants

```
AssurancePack / Gov / ARENA
AssurancePack / Gov / CEFC
```

### Both Inherit from Style A, With:

| Customisation | Implementation |
|---------------|----------------|
| Heading text | Swapped per agency |
| Section order | Adjusted per template |
| Terminology tokens | Applied per mapping |

### Figma Components to Create

| Component | Variants |
|-----------|----------|
| Export/Gov/Cover | ARENA, CEFC |
| Export/Gov/SectionHeader | ARENA, CEFC |
| Export/Gov/RiskTable | ARENA (with mitigations), CEFC (indicators only) |
| Export/Gov/CovenantTable | CEFC only |
| Export/Gov/Disclaimer | ARENA, CEFC |

---

## Engineering Implementation

### Export Engine Logic

```typescript
// Select template based on agency flag
const template = selectTemplate(agencyFlag);

// Content populated from same schema
const content = populateFromSchema(assurancePack, template);

// Apply terminology tokens
const output = applyTerminology(content, template.terminology);
```

### Branching Logic (Minimal)

| Branch Point | Implementation |
|--------------|----------------|
| Heading labels | Template-specific strings |
| Disclaimer blocks | Template-specific text |
| Section inclusion/exclusion | Template configuration |

### No Branching Required For

- Data transformation
- Schema structure
- Evidence presentation
- Signal interpretation

---

## Terminology Token System

### ARENA Tokens

```json
{
  "assurance_level": "Supply assurance level",
  "confidence": "Confidence level",
  "signals": "Risks and mitigations",
  "monitoring": "Oversight arrangements",
  "evidence": "Supporting documentation",
  "compliance": "Regulatory alignment"
}
```

### CEFC Tokens

```json
{
  "assurance_level": "Assessment",
  "confidence": "Assessment confidence",
  "signals": "Risk indicators",
  "monitoring": "Credit monitoring",
  "evidence": "Verified documentation",
  "compliance": "Covenant compliance"
}
```

---

## Strategic Value

With this mapping:

| Capability | Benefit |
|------------|---------|
| No report rewriting per agency | Efficiency |
| No consultant dependency | Cost savings |
| No accidental commercial exposure | Risk management |
| Grant- and finance-native | Market positioning |

> ABFI now speaks government, credit, and audit fluently — without changing who you are.

---

## Implementation Checklist

### ARENA Template
- [ ] Create cover page variant
- [ ] Create project context page
- [ ] Create supply overview page (no volumes)
- [ ] Create risk & mitigation page
- [ ] Create compliance page
- [ ] Create monitoring page
- [ ] Create methodology & disclaimer page
- [ ] Apply ARENA terminology tokens
- [ ] Test FOI-safe output

### CEFC Template
- [ ] Create cover page variant
- [ ] Create transaction overview page
- [ ] Create supply assessment page
- [ ] Create covenant monitoring page
- [ ] Create evidence verification page
- [ ] Create change detection page
- [ ] Create disclaimer page
- [ ] Apply CEFC terminology tokens
- [ ] Test credit memo format

### Engineering
- [ ] Define agency flag enum
- [ ] Create template selector function
- [ ] Build terminology token system
- [ ] Implement section inclusion logic
- [ ] Create ARENA export endpoint
- [ ] Create CEFC export endpoint
- [ ] Test both export paths
- [ ] Validate output compliance

---

## Sample Output Comparison

### Same Data, Different Framing

**ABFI Source:**
```json
{
  "assurance": {
    "level": "good",
    "confidence": "medium"
  },
  "signals": [
    {
      "category": "delivery",
      "status": "attention",
      "description": "Seasonal variability detected"
    }
  ]
}
```

**ARENA Output:**
```
Supply Assurance Level: Good
Confidence Level: Medium

Key Risks and Mitigation Measures:
• Seasonal variability — Mitigated through diversified supply sourcing — Monitoring ongoing
```

**CEFC Output:**
```
Assessment: Good
Assessment Confidence: Medium

Risk Indicators:
• Delivery: Attention (Seasonal variability detected)
```

> Same data. Different framing. Both compliant.

