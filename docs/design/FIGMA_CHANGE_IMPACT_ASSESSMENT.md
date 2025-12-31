# ABFI Product Change Impact Assessment (PCIA)

**Version:** 1.0 · Mandatory Pre-Change Control

| Property | Value |
|----------|-------|
| **Status** | Active |
| **Applies to** | All ABFI platform changes |
| **Owner** | Design Authority Holder |
| **Required for** | Any change beyond cosmetic fixes |

---

## 1. Purpose

The Product Change Impact Assessment ensures that no change to ABFI:

| Protection | Description |
|------------|-------------|
| Undermines institutional credibility | Maintains trust |
| Creates regulatory, audit, or credit exposure | Manages risk |
| Fragments the design system | Preserves consistency |
| Introduces ungoverned complexity | Controls entropy |

> **No change may proceed to build without a completed PCIA where required.**

---

## 2. When a PCIA Is Required

### Automatically In Scope

A PCIA **MUST** be completed if a change affects any of the following:

| Trigger | Always Requires PCIA |
|---------|---------------------|
| New modules | ✅ |
| New user roles | ✅ |
| New dashboards | ✅ |
| New exports or reports | ✅ |
| Changes to scoring, signals, or confidence logic | ✅ |
| Changes visible to lenders or government | ✅ |
| Changes affecting evidence, monitoring, or assurance | ✅ |

### Not Required Only If ALL Are True

| Condition | Must Be True |
|-----------|--------------|
| Pure bug fix | ✅ |
| No UI change | ✅ |
| No data model change | ✅ |
| No behavioural change | ✅ |
| No copy or terminology change | ✅ |

> **If uncertain → PCIA is required.**

---

## 3. Change Metadata (Mandatory)

| Field | Value |
|-------|-------|
| **Change title** | _Short, factual description_ |
| **Change ID** | _Assigned by PM or Design Authority_ |
| **Requested by** | _Role / team_ |
| **Date raised** | _YYYY-MM-DD_ |
| **Target release** | _Version / date_ |

### Change Category (Select One)

| Category | Selected |
|----------|----------|
| UI refinement | ☐ |
| New variant | ☐ |
| New component | ☐ |
| New module | ☐ |
| Data model change | ☐ |
| Export/reporting change | ☐ |
| Scoring / logic change | ☐ |
| Terminology change | ☐ |

---

## 4. Change Description

### 4.1 What Is Changing?

_Plain-language description of the change. Avoid implementation detail. Focus on user-visible or system-visible behaviour._

```
[Enter description here]
```

### 4.2 Why Is This Change Needed?

Select all that apply:

| Reason | Selected |
|--------|----------|
| User friction | ☐ |
| Regulatory requirement | ☐ |
| Partner request | ☐ |
| Performance issue | ☐ |
| Scale requirement | ☐ |
| Strategic alignment | ☐ |
| Other (explain) | ☐ |

If Other:
```
[Enter explanation here]
```

---

## 5. Module Impact Analysis (Mandatory)

Tick all modules affected and describe impact.

| Module | Affected? | Impact Summary |
|--------|-----------|----------------|
| Identity & Access | ☐ | |
| Onboarding & Registration | ☐ | |
| Grower Workspace | ☐ | |
| Feedstock Registry | ☐ | |
| Evidence & Verification | ☐ | |
| Scoring & Intelligence (RSIE) | ☐ | |
| Marketplace & Demand Signals | ☐ | |
| Deal Room | ☐ | |
| Contracted Execution | ☐ | |
| Monitoring & Signals | ☐ | |
| Assurance Outputs | ☐ | |
| Administration & Governance | ☐ | |

---

## 6. Role Impact Analysis (Mandatory)

Describe how behaviour, visibility, or obligations change per role.

| Role | Impacted? | Description |
|------|-----------|-------------|
| Grower | ☐ | |
| Developer | ☐ | |
| Lender | ☐ | |
| Government | ☐ | |
| Admin / Assessor | ☐ | |

> **Rule:** If a role is impacted, the change must be reviewed from that role's perspective in design.

---

## 7. Design Authority Checks (Mandatory)

Answer YES / NO to each.

| Question | Yes | No |
|----------|-----|-----|
| Uses existing components or variants | ☐ | ☐ |
| Introduces new component | ☐ | ☐ |
| Alters component meaning or behaviour | ☐ | ☐ |
| Changes information hierarchy | ☐ | ☐ |
| Introduces new terminology | ☐ | ☐ |
| Affects role-based disclosure | ☐ | ☐ |

### Escalation Required If YES To:

| Trigger | Escalation |
|---------|------------|
| New component | Design Authority approval required |
| Terminology change | Design Authority approval required |
| Role-based disclosure | Design Authority approval required |

---

## 8. Data & Logic Impact (Critical)

### 8.1 Data Model Impact

| Question | Yes | No |
|----------|-----|-----|
| New fields? | ☐ | ☐ |
| Field removal? | ☐ | ☐ |
| Field meaning changed? | ☐ | ☐ |
| Snapshot logic affected? | ☐ | ☐ |

**Describe impact:**
```
[Enter description here]
```

### 8.2 Scoring / Signal Impact

| Question | Yes | No |
|----------|-----|-----|
| Bankability score affected? | ☐ | ☐ |
| Confidence level affected? | ☐ | ☐ |
| Monitoring signals affected? | ☐ | ☐ |

**If yes, explain:**

| Aspect | Description |
|--------|-------------|
| Change explanation | |
| Backward compatibility | |
| Audit implications | |

---

## 9. Export & Reporting Impact

Does this change affect:

| Export Type | Affected? |
|-------------|-----------|
| Assurance Pack | ☐ |
| Government reporting | ☐ |
| Covenant monitoring | ☐ |

**If yes:**

| Requirement | Confirmed |
|-------------|-----------|
| Sections impacted listed | ☐ |
| Legal language remains compliant | ☐ |
| Export remains snapshot-based | ☐ |

---

## 10. Regulatory & Audit Risk Assessment

Rate each risk: **Low / Medium / High**

| Area | Risk | Notes |
|------|------|-------|
| FOI exposure | | |
| ANAO review | | |
| Credit committee scrutiny | | |
| Legal defensibility | | |
| Reputational risk | | |

> **If any High → escalation required.**

---

## 11. User Impact & Migration

### 11.1 Existing Users

| Question | Yes | No |
|----------|-----|-----|
| Behaviour change required? | ☐ | ☐ |
| Retraining required? | ☐ | ☐ |
| Communication required? | ☐ | ☐ |

**Describe mitigation:**
```
[Enter mitigation plan here]
```

### 11.2 Backward Compatibility

| Question | Yes | No |
|----------|-----|-----|
| Existing records remain valid? | ☐ | ☐ |
| Historical exports unaffected? | ☐ | ☐ |

---

## 12. Test & Acceptance Criteria

Define objective, testable criteria.

| Criterion | Pass/Fail |
|-----------|-----------|
| _Example: Grower dashboard still shows max 3 KPIs_ | ☐ |
| _Example: Assurance Pack renders correctly in grayscale_ | ☐ |
| _Example: No new terminology appears in exports_ | ☐ |
| _Example: No role sees additional data without approval_ | ☐ |
| | ☐ |
| | ☐ |
| | ☐ |

---

## 13. Approvals

| Role | Name | Date | Decision |
|------|------|------|----------|
| Product Owner | | | ☐ Approve ☐ Reject |
| Design Authority Holder | | | ☐ Approve ☐ Reject |
| Legal (if required) | | | ☐ Approve ☐ Reject |
| Exec (if required) | | | ☐ Approve ☐ Reject |

---

## 14. Decision Outcome

**Final decision:**

| Decision | Selected |
|----------|----------|
| Approved | ☐ |
| Approved with conditions | ☐ |
| Rejected | ☐ |

**Conditions (if any):**
```
[Enter conditions here]
```

---

## 15. Archiving & Traceability

| Requirement | Implementation |
|-------------|----------------|
| PCIA stored with release artefacts | ✅ |
| Linked to PR(s) | |
| Linked to Figma versions | |
| Linked to Export schema version | |
| Retained indefinitely | ✅ |

---

## 16. Enforcement Statement

> **No change subject to this assessment may be released without a completed and approved PCIA.**

> **Failure to comply constitutes a governance breach.**

---

## Quick Reference: When Is PCIA Required?

| Change Type | PCIA Required? |
|-------------|----------------|
| Bug fix (no UI change) | No |
| Typo correction | No |
| New dashboard | **Yes** |
| New component | **Yes** |
| New export type | **Yes** |
| Scoring logic change | **Yes** |
| Lender-visible change | **Yes** |
| Government-visible change | **Yes** |
| Terminology change | **Yes** |
| New variant of existing component | **Yes** |
| New module | **Yes** |

---

## Template Usage

1. Copy this template for each change requiring assessment
2. Complete all mandatory sections
3. Route for required approvals
4. Store with release artefacts
5. Link to implementation PR

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FIGMA_DESIGN_AUTHORITY_DOCUMENT.md` | Governs this process |
| `FIGMA_PLATFORM_DESIGN_BRIEF.md` | Defines modules and roles |
| `FIGMA_COMPONENT_CONTRACTS.md` | Component specifications |

