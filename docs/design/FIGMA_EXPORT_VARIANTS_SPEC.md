# ABFI Export Variants & Data Schema — v1

**Design Philosophy:** Institutional-grade · Audit-defensible · Automation-ready

---

## Overview

This document covers three critical system capabilities:

| Variant | Purpose | Audience |
|---------|---------|----------|
| **Government Reporting** | Public funding accountability | ARENA, CEFC, NRF, State Gov |
| **Covenant Monitoring** | Ongoing risk position tracking | Lenders |
| **Data Schema** | Structural backbone for all exports | Technical / Audit |

---

# Part 1: Government / Grant Reporting Variant

**Agencies:** ARENA · CEFC · NRF · State Gov

> This is not a new product — it is a filtered, re-framed export of the Assurance Pack.

---

## 1) Purpose

This variant exists to answer:

> "Is public money being deployed against a credible, monitored, compliant supply chain?"

### Design Requirements

| Requirement | Reason |
|-------------|--------|
| Readable by non-specialists | Agency staff vary in technical depth |
| Avoid commercial sensitivity | FOI compliance |
| Australian public-sector language | Tone alignment |
| Survive FOI scrutiny | Legal safety |

---

## 2) Entry Point (UI)

### Location

| Element | Value |
|---------|-------|
| **Trigger** | Contracted Dashboard |
| **CTA type** | Secondary (Lender & Developer roles) |
| **Button label** | Download government reporting summary |

### Modal Options

#### Target Agency Selection

| Option | Description |
|--------|-------------|
| ARENA | Australian Renewable Energy Agency |
| CEFC | Clean Energy Finance Corporation |
| NRF | National Reconstruction Fund |
| State Government | Various state programs |

#### Scope Selection

| Option | Default |
|--------|---------|
| Summary only | Yes (default) |
| Full technical appendix | Optional |

---

## 3) Document Structure (Government Variant)

### Page 1 — Cover

| Element | Content |
|---------|---------|
| **Title** | ABFI Government Reporting Summary |
| **Subheading** | Feedstock supply assurance for funded energy projects |
| **Project name** | NT SAF Facility |
| **Grant / facility reference** | ARENA-2024-0123 (optional field) |
| **Reporting period** | Q1 2025 |
| **Issue date** | 15 May 2025 |

**Footer:**
> Prepared for government reporting purposes. Commercial terms excluded.

---

### Page 2 — Public Interest Summary (Plain English)

*This is the most important page.*

#### Section: Project Purpose (1 paragraph)

> The NT SAF Facility is a sustainable aviation fuel production plant located in the Northern Territory. The project aims to produce 50 million litres of SAF annually using locally-sourced biomass feedstock.

#### Section: Feedstock Role in Project (1 paragraph)

> Biomass feedstock represents the primary input material for the production process. Secure, verified feedstock supply is essential to project viability and emissions reduction outcomes.

#### Section: Current Status (bullet points)

| Finding |
|---------|
| Feedstock supply has been verified against stated production capacity. |
| Monitoring indicates no material delivery or compliance risks at this time. |
| All required certifications are current and valid. |
| Supply contract is active with quarterly delivery schedule. |

---

### Page 3 — Supply Assurance Snapshot

#### Table (No volumes, No prices)

| Field | Value |
|-------|-------|
| Feedstock type | Bamboo biomass |
| Region | Northern Territory |
| Contract status | Active |
| Delivery cadence | Quarterly |
| Monitoring enabled | Yes |

**Note:** Volume and pricing details excluded per government reporting requirements.

---

### Page 4 — Compliance & Standards Alignment

#### Checklist

| Check | Status |
|-------|--------|
| Sustainability certification | Pass |
| Regulatory alignment | Pass |
| Audit flags | None |

#### Narrative

> All reviewed materials align with current regulatory and program requirements. The project demonstrates compliance with applicable environmental standards and funding conditions.

---

### Page 5 — Monitoring & Oversight

#### Summary Table

| Element | Value |
|---------|-------|
| Monitoring cadence | Quarterly |
| Signals tracked | Delivery, Evidence validity, Compliance |
| Escalation mechanism | Automatic alerts on material changes |

#### Narrative

> ABFI monitors supply continuity, evidence validity, and compliance indicators throughout the contract period. Any material changes are flagged for review and reported in subsequent summaries.

---

### Page 6 — Disclaimer & Methodology

#### Explicit Statements

| Statement |
|-----------|
| ABFI is not certifying financial performance. |
| Data reflects reporting period only. |
| Further due diligence remains with funding body. |
| This summary does not constitute an audit or assurance engagement. |

---

## 4) Style Overrides (Government Variant)

| Override | Specification |
|----------|---------------|
| Color usage | Even less than Style A |
| Numerical scores | Hidden unless explicitly requested |
| "Bankability" term | Replace with "Supply assurance level" |
| Commercial terms | Excluded entirely |
| Pricing information | Never included |

---

## 5) Strategic Value

| Benefit | Impact |
|---------|--------|
| Aligns with ARENA / CEFC reporting tone | Credibility |
| Avoids FOI landmines | Risk reduction |
| Useful after funding awarded | Long-term value |
| Positions ABFI as oversight infrastructure | Market positioning |

> ABFI becomes oversight infrastructure, not a lobbyist.

---

# Part 2: Automated Covenant Monitoring Summary

**Delivery:** Monthly / Quarterly · Lender-grade · Non-intrusive

> This is not a dashboard — it is a periodic, machine-generated summary lenders actually want.

---

## 1) Purpose

Answer one question, repeatedly:

> "Has anything changed that affects our risk position?"

Nothing more.

---

## 2) Delivery Modes

| Mode | Format | Frequency |
|------|--------|-----------|
| PDF snapshot | Attached document | Monthly / Quarterly |
| Email summary | Inline (1 page max) | Configurable |
| API payload | JSON | Future |

---

## 3) Document Structure (1–2 Pages Only)

### Section 1 — Monitoring Period

| Field | Value |
|-------|-------|
| Reporting window | 1 Apr 2025 — 30 Jun 2025 |
| Contract ID | CTR-2024-0847 |
| Monitoring scope | Full (delivery, evidence, compliance) |

---

### Section 2 — Covenant Status Summary

#### Status Table

| Covenant Area | Status | Change Since Last Period |
|---------------|--------|--------------------------|
| Supply continuity | Pass | No change |
| Evidence validity | Pass | No change |
| Compliance alignment | Pass | No change |
| Delivery performance | Attention | New |

#### Status Definitions

| Status | Meaning |
|--------|---------|
| **Pass** | Meets requirements |
| **Attention** | Requires review |
| **Breach** | Covenant violation |

---

### Section 3 — Changes Detected (If Any)

*Only shown if applicable.*

| Change |
|--------|
| One document will expire within 30 days and requires renewal. |
| Q2 delivery volume was 5% below target threshold. |

---

### Section 4 — Required Actions (If Any)

| Action | Responsible Party | Due Date | Status |
|--------|------------------|----------|--------|
| Renew insurance certificate | Supplier | 2025-07-01 | Pending |
| Provide delivery explanation | Supplier | 2025-07-15 | Pending |

---

### Section 5 — Statement of Record

> This summary reflects automated monitoring outputs as of the reporting date.

**No commentary. No opinions.**

---

## 4) Automation Rules (Critical)

### No Change Scenario

If no change detected, summary must explicitly state:

> "No material changes detected."

### Content Rules

| Rule | Enforcement |
|------|-------------|
| Never generate narrative beyond templates | Strict |
| Never infer intent or fault | Strict |
| Never include subjective commentary | Strict |
| Always include explicit timestamp | Strict |

---

## 5) Strategic Value

| Benefit | Impact |
|---------|--------|
| Removes ad-hoc lender emails | Efficiency |
| Reduces monitoring cost | Scalability |
| Positions ABFI inside credit governance | Stickiness |
| Enables scale without humans | Automation |

---

# Part 3: Assurance Pack Data Schema

**Purpose:** API · Versioning · Audit-safe

> This is the structural backbone that makes everything above defensible.

---

## 1) Core Design Principles

| Principle | Implementation |
|-----------|----------------|
| Snapshot-based | Immutable at generation |
| Versioned | Schema version tracking |
| Hashable | SHA-256 integrity check |
| Human-readable first | JSON with clear naming |
| Machine-readable second | Standard formats |

---

## 2) Top-Level Object

```json
{
  "assurance_pack_id": "UUID",
  "contract_id": "UUID",
  "project_id": "UUID",
  "generated_at": "ISO-8601",
  "version": "v1.0",
  "scope": "assurance | government | covenant",
  "status": "active",
  "hash": "SHA-256"
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `assurance_pack_id` | UUID | Unique identifier for this export |
| `contract_id` | UUID | Reference to source contract |
| `project_id` | UUID | Reference to project |
| `generated_at` | ISO-8601 | Timestamp of generation |
| `version` | string | Schema version (e.g., "v1.0") |
| `scope` | enum | Type of export |
| `status` | string | Contract status at generation |
| `hash` | string | SHA-256 content hash |

---

## 3) Section Objects

### Contract Snapshot

```json
{
  "contract": {
    "status": "active",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "delivery_cadence": "quarterly",
    "monitoring_enabled": true
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | enum | active, completed, terminated |
| `start_date` | date | Contract start |
| `end_date` | date | Contract end |
| `delivery_cadence` | enum | monthly, quarterly, annual |
| `monitoring_enabled` | boolean | Whether monitoring is active |

---

### Bankability / Assurance Summary

```json
{
  "assurance": {
    "level": "good",
    "confidence": "medium",
    "drivers_positive": [
      "Verified production capacity",
      "Geographic consistency",
      "Strong counterparty profile"
    ],
    "drivers_risk": [
      "Seasonal variability",
      "Logistics documentation pending"
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `level` | enum | excellent, good, medium, risk |
| `confidence` | enum | high, medium, low |
| `drivers_positive` | array | Positive factors (max 5) |
| `drivers_risk` | array | Risk factors (max 5) |

---

### Evidence Summary

```json
{
  "evidence": [
    {
      "type": "sustainability_certificate",
      "status": "verified",
      "last_updated": "YYYY-MM-DD",
      "valid_until": "YYYY-MM-DD"
    },
    {
      "type": "quality_testing",
      "status": "verified",
      "last_updated": "YYYY-MM-DD",
      "valid_until": "YYYY-MM-DD"
    },
    {
      "type": "insurance",
      "status": "expiring",
      "last_updated": "YYYY-MM-DD",
      "valid_until": "YYYY-MM-DD"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | enum | Evidence category |
| `status` | enum | verified, pending, expiring, expired |
| `last_updated` | date | Last modification date |
| `valid_until` | date | Expiry date (if applicable) |

#### Evidence Types Enum

| Type | Description |
|------|-------------|
| `sustainability_certificate` | ISCC, RSB, etc. |
| `quality_testing` | Lab results |
| `insurance` | Insurance certificate |
| `production_capacity` | Capacity verification |
| `property_boundary` | Geographic verification |
| `logistics_assessment` | Transport documentation |

---

### Monitoring Signals

```json
{
  "signals": [
    {
      "category": "delivery",
      "status": "attention",
      "detected_at": "YYYY-MM-DD",
      "description": "Delivery window approaching"
    },
    {
      "category": "evidence",
      "status": "attention",
      "detected_at": "YYYY-MM-DD",
      "description": "Document expiring within 30 days"
    },
    {
      "category": "compliance",
      "status": "clear",
      "detected_at": "YYYY-MM-DD",
      "description": "No issues detected"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `category` | enum | Signal category |
| `status` | enum | clear, attention, breach |
| `detected_at` | date | When signal was raised |
| `description` | string | Human-readable description |

#### Signal Categories Enum

| Category | Monitors |
|----------|----------|
| `delivery` | Delivery schedule and volumes |
| `evidence` | Document validity and freshness |
| `compliance` | Regulatory and certification alignment |
| `weather` | Environmental factors |
| `counterparty` | Counterparty risk indicators |

---

### Activity Snapshot

```json
{
  "activity": [
    {
      "timestamp": "ISO-8601",
      "actor": "supplier",
      "action": "document_uploaded",
      "category": "evidence"
    },
    {
      "timestamp": "ISO-8601",
      "actor": "system",
      "action": "monitoring_check",
      "category": "review"
    },
    {
      "timestamp": "ISO-8601",
      "actor": "buyer",
      "action": "terms_accepted",
      "category": "update"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO-8601 | When action occurred |
| `actor` | enum | Who performed action |
| `action` | string | Action identifier |
| `category` | enum | Action category |

#### Actor Types Enum

| Actor | Description |
|-------|-------------|
| `supplier` | Grower/Producer |
| `buyer` | Developer |
| `lender` | Finance party |
| `system` | ABFI automation |
| `abfi` | ABFI reviewer |

#### Action Categories Enum

| Category | Examples |
|----------|----------|
| `evidence` | Document upload, verification |
| `review` | Monitoring check, assessment |
| `update` | Status change, terms modification |

---

## 4) Versioning Rules

| Rule | Specification |
|------|---------------|
| Schema version increment | Only when structure changes |
| Content changes | Do not alter schema version |
| Required fields | Every export must include: |

### Required Metadata Fields

| Field | Purpose |
|-------|---------|
| `schema_version` | Structure version |
| `content_hash` | Integrity verification |
| `generated_at` | Timestamp |

---

## 5) Example Complete Export

```json
{
  "assurance_pack_id": "ap-2025-0515-001",
  "contract_id": "ctr-2024-0847",
  "project_id": "prj-2024-0123",
  "generated_at": "2025-05-15T14:32:00Z",
  "schema_version": "v1.0",
  "scope": "assurance",
  "status": "active",
  "content_hash": "sha256:a1b2c3d4e5f6...",

  "contract": {
    "status": "active",
    "start_date": "2025-01-01",
    "end_date": "2029-12-31",
    "delivery_cadence": "quarterly",
    "monitoring_enabled": true
  },

  "assurance": {
    "level": "good",
    "confidence": "medium",
    "drivers_positive": [
      "Verified production capacity",
      "Geographic consistency"
    ],
    "drivers_risk": [
      "Seasonal variability"
    ]
  },

  "evidence": [
    {
      "type": "sustainability_certificate",
      "status": "verified",
      "last_updated": "2024-11-02",
      "valid_until": "2026-11-02"
    }
  ],

  "signals": [
    {
      "category": "delivery",
      "status": "clear",
      "detected_at": "2025-05-15",
      "description": "All deliveries on schedule"
    }
  ],

  "activity": [
    {
      "timestamp": "2025-05-02T10:00:00Z",
      "actor": "supplier",
      "action": "document_uploaded",
      "category": "evidence"
    }
  ]
}
```

---

## 6) Strategic Value

| Benefit | Impact |
|---------|--------|
| Defensible under audit | Legal protection |
| Enables regulator integrations | Future-ready |
| Allows historical comparisons | Analytics |
| Prevents tampering accusations | Trust |

---

# Final State Summary

You now have complete documentation for:

| Capability | Status |
|------------|--------|
| Platform UX | ✅ Documented |
| Role dashboards (Grower/Developer/Lender) | ✅ Documented |
| Deal lifecycle (Deal Room) | ✅ Documented |
| Contract execution (Contracted Dashboard) | ✅ Documented |
| Institutional assurance output | ✅ Documented |
| Government-safe reporting | ✅ Documented |
| Automated covenant monitoring | ✅ Documented |
| API-grade data schema | ✅ Documented |

> This is end-to-end infrastructure, not a UI exercise.

---

## Implementation Checklist

### Government Reporting Variant
- [ ] Create modal for agency/scope selection
- [ ] Build cover page template (gov variant)
- [ ] Build public interest summary page
- [ ] Build supply assurance snapshot page
- [ ] Build compliance checklist page
- [ ] Build monitoring summary page
- [ ] Build disclaimer page
- [ ] Test FOI-safe content filtering

### Covenant Monitoring Summary
- [ ] Define monitoring schedule triggers
- [ ] Create status change detection logic
- [ ] Build covenant status table component
- [ ] Build changes detected section
- [ ] Build required actions table
- [ ] Create email template
- [ ] Test "no change" scenario
- [ ] Implement PDF generation

### Data Schema
- [ ] Define TypeScript interfaces
- [ ] Implement UUID generation
- [ ] Implement SHA-256 hashing
- [ ] Create JSON export function
- [ ] Add schema version tracking
- [ ] Build validation layer
- [ ] Test historical comparison
- [ ] Document API endpoints

