# Deal Room Dashboard — v1 Content Pack

**Design Philosophy:** Shared workspace · Contract-focused · Evidence-led

---

## Deal Room Design Intent (Core Principles)

### Primary Purpose
Move from interest → confidence → contract

### Core Principles
| Principle | Implementation |
|-----------|----------------|
| **Shared workspace** | Both parties see the same data, same progress |
| **Evidence-led** | Confidence grows as evidence is uploaded and verified |
| **Contract-focused** | Every interaction moves toward binding agreement |
| **Role-aware** | Each party sees actions relevant to their role |
| **Transparent progress** | Clear stages, visible blockers, no hidden state |

---

## Component System Used

| Component | Purpose |
|-----------|---------|
| **DealRoomHeader** | Deal name, stage, parties, primary actions |
| **DealProgressStepper** | Visual stage progression (5 stages) |
| **DealStatTile** | Key metrics (volume, value, confidence) |
| **EvidenceChecklist** | Upload progress by category |
| **TermsCard** | Editable term fields with lock/unlock |
| **ActivityFeed** | Chronological updates and comments |
| **PartyCard** | Contact info, role, verification status |
| **ExplainerCarousel** | Contextual guidance by stage |
| **EmptyState** | No deals, no evidence, no activity |

---

## Deal Room Stage Progression

| Stage | Label | Description |
|-------|-------|-------------|
| 1 | Draft | Deal created, terms being defined |
| 2 | Shared | Invited party has access |
| 3 | Negotiation | Active term discussions |
| 4 | Agreed | Terms locked, pending signatures |
| 5 | Contracted | Binding agreement in place |

---

## 1) Deal Room Landing Dashboard

### PageHeader

| Element | Content |
|---------|---------|
| **Title** | Deal Rooms |
| **Subtitle** | Manage active negotiations and agreements |
| **Primary action** | Create deal room |

### StatsGrid (3 Tiles)

#### Tile 1 — Active Deals

| Element | Content |
|---------|---------|
| **Label** | Active Deals |
| **Value** | 4 |
| **Helper** | In negotiation or pending |

#### Tile 2 — Awaiting Response

| Element | Content |
|---------|---------|
| **Label** | Awaiting Response |
| **Value** | 2 |
| **Helper** | Deals waiting on counterparty |

#### Tile 3 — Contracted

| Element | Content |
|---------|---------|
| **Label** | Contracted |
| **Value** | 1 |
| **Helper** | Binding agreements in place |

---

## 2) Deal Room List Section

### SectionHeader

| Element | Content |
|---------|---------|
| **Title** | Your deal rooms |
| **Filter tabs** | All · Active · Contracted |

### DealRoomSummaryCard — Active

| Element | Content |
|---------|---------|
| **Deal name** | NT SAF Facility — Bamboo Supply |
| **Counterparty** | GreenGrow Biomass Co |
| **Stage** | Negotiation |
| **Stage tone** | `active` |
| **Volume** | 120,000 tpa |
| **Value** | $2.4M indicative |
| **Evidence progress** | 4 of 6 items |
| **Last activity** | Terms updated 2 days ago |
| **Primary action** | Open deal room |

### DealRoomSummaryCard — Awaiting Response

| Element | Content |
|---------|---------|
| **Deal name** | QLD Bioethanol — Sugarcane Bagasse |
| **Counterparty** | Mackay Sugar Mills |
| **Stage** | Shared |
| **Stage tone** | `waiting` |
| **Volume** | 85,000 tpa |
| **Value** | TBD |
| **Evidence progress** | 2 of 6 items |
| **Last activity** | Invitation sent 5 days ago |
| **Primary action** | View deal room |
| **Secondary action** | Send reminder |

### DealRoomSummaryCard — Contracted

| Element | Content |
|---------|---------|
| **Deal name** | Gippsland Biomethane — Forestry Residues |
| **Counterparty** | Victorian Forestry Co-op |
| **Stage** | Contracted |
| **Stage tone** | `success` |
| **Volume** | 60,000 tpa |
| **Value** | $1.8M contracted |
| **Contract date** | Signed 15 Nov 2024 |
| **Primary action** | View contract |

### Empty State — No Deal Rooms

| Element | Content |
|---------|---------|
| **Title** | No deal rooms yet |
| **Description** | Create a deal room to start negotiating terms with a supplier or buyer. |
| **CTA** | Create deal room |

---

## 3) Deal Room Detail View

### DealRoomHeader

| Element | Content |
|---------|---------|
| **Deal name** | NT SAF Facility — Bamboo Supply |
| **Stage chip** | Negotiation |
| **Stage tone** | `active` |
| **Grower** | GreenGrow Biomass Co |
| **Developer** | NT SAF Holdings |
| **Primary action** | Propose terms |
| **Secondary action** | Request evidence |

### DealProgressStepper

| Element | Content |
|---------|---------|
| **Step 1** | Draft ✓ |
| **Step 2** | Shared ✓ |
| **Step 3** | Negotiation (current) |
| **Step 4** | Agreed |
| **Step 5** | Contracted |

### StatsRow (4 Tiles)

#### Tile 1 — Volume

| Element | Content |
|---------|---------|
| **Label** | Volume |
| **Value** | 120,000 tpa |
| **Helper** | Annual contracted volume |

#### Tile 2 — Indicative Value

| Element | Content |
|---------|---------|
| **Label** | Indicative Value |
| **Value** | $2.4M |
| **Helper** | Based on current terms |

#### Tile 3 — Evidence

| Element | Content |
|---------|---------|
| **Label** | Evidence |
| **Value** | 4 of 6 |
| **Helper** | Items verified |

#### Tile 4 — Confidence

| Element | Content |
|---------|---------|
| **Label** | Confidence |
| **Value** | Medium |
| **Helper** | Based on evidence completeness |

---

## 4) Deal Room Tabs

### Tab Navigation

| Tab | Label |
|-----|-------|
| 1 | Overview |
| 2 | Evidence |
| 3 | Terms |
| 4 | Activity |

---

## 5) Tab 1: Overview

### PartyCard — Grower

| Element | Content |
|---------|---------|
| **Role label** | Supplier |
| **Company name** | GreenGrow Biomass Co |
| **Contact** | Sarah Chen, Supply Manager |
| **Verification status** | Verified ✓ |
| **ABN** | 12 345 678 901 |
| **Action** | View profile |

### PartyCard — Developer

| Element | Content |
|---------|---------|
| **Role label** | Buyer |
| **Company name** | NT SAF Holdings |
| **Contact** | Michael Torres, Procurement Lead |
| **Verification status** | Verified ✓ |
| **ABN** | 98 765 432 109 |
| **Action** | View profile |

### DealSummaryCard

| Element | Content |
|---------|---------|
| **Title** | Deal summary |
| **Feedstock** | Bamboo biomass |
| **Location** | Northern Territory |
| **Volume** | 120,000 tonnes per annum |
| **Delivery** | Annual, Q1 start |
| **Duration** | 5-year offtake |
| **Pricing basis** | Fixed + CPI escalation |

### NextStepCard (Deal Context)

| Element | Content |
|---------|---------|
| **Title** | Next step to progress |
| **Body** | Upload remaining evidence to increase confidence and unlock term negotiation. |
| **Primary CTA** | Upload evidence |
| **Checklist item 1** | Quality test results — ⏳ |
| **Checklist item 2** | Sustainability certification — ⏳ |

---

## 6) Tab 2: Evidence

### EvidenceChecklist

| Element | Content |
|---------|---------|
| **Title** | Evidence checklist |
| **Helper** | Upload and verify documents to build confidence |
| **Progress** | 4 of 6 items complete |

### Evidence Items

| Item | Status | Uploaded by |
|------|--------|-------------|
| Property boundary verification | ✅ Verified | Grower |
| Production capacity proof | ✅ Verified | Grower |
| Quality test results | ⏳ Pending | — |
| Sustainability certification | ⏳ Pending | — |
| Insurance certificate | ✅ Uploaded | Grower |
| Logistics assessment | ✅ Uploaded | Developer |

### EvidenceUploadCard

| Element | Content |
|---------|---------|
| **Title** | Upload evidence |
| **Description** | Drag and drop files or click to browse |
| **Accepted formats** | PDF, JPG, PNG (max 10MB) |
| **CTA** | Browse files |

### Empty State — No Evidence

| Element | Content |
|---------|---------|
| **Title** | No evidence uploaded yet |
| **Description** | Evidence builds confidence and unlocks term negotiation. |
| **CTA** | Upload first document |

---

## 7) Tab 3: Terms

### TermsCard — Volume & Delivery

| Element | Content |
|---------|---------|
| **Section title** | Volume & Delivery |
| **Field 1 label** | Annual volume |
| **Field 1 value** | 120,000 tonnes |
| **Field 1 status** | Agreed ✓ |
| **Field 2 label** | Delivery window |
| **Field 2 value** | Q1 annually |
| **Field 2 status** | Proposed |
| **Field 3 label** | Contract duration |
| **Field 3 value** | 5 years |
| **Field 3 status** | Under discussion |

### TermsCard — Pricing

| Element | Content |
|---------|---------|
| **Section title** | Pricing |
| **Field 1 label** | Base price |
| **Field 1 value** | $85 / tonne |
| **Field 1 status** | Proposed |
| **Field 2 label** | Escalation |
| **Field 2 value** | CPI annually |
| **Field 2 status** | Proposed |
| **Field 3 label** | Payment terms |
| **Field 3 value** | 30 days from delivery |
| **Field 3 status** | Under discussion |

### TermsCard — Quality & Compliance

| Element | Content |
|---------|---------|
| **Section title** | Quality & Compliance |
| **Field 1 label** | Moisture content |
| **Field 1 value** | ≤15% |
| **Field 1 status** | Agreed ✓ |
| **Field 2 label** | Contamination threshold |
| **Field 2 value** | ≤2% |
| **Field 2 status** | Agreed ✓ |
| **Field 3 label** | Certification required |
| **Field 3 value** | ISCC or equivalent |
| **Field 3 status** | Proposed |

### Term Status Legend

| Status | Meaning | Display |
|--------|---------|---------|
| Agreed | Both parties confirmed | Green check |
| Proposed | One party suggested | Blue dot |
| Under discussion | Active negotiation | Yellow dot |
| Rejected | Not accepted | Red cross |

### TermsActionBar

| Element | Content |
|---------|---------|
| **Primary action** | Propose updated terms |
| **Secondary action** | Accept all proposed |
| **Tertiary action** | Export term sheet |

---

## 8) Tab 4: Activity

### ActivityFeed

| Element | Content |
|---------|---------|
| **Title** | Activity |
| **Filter** | All · Comments · Updates |

### Activity Items

| Timestamp | Actor | Action |
|-----------|-------|--------|
| 2 days ago | Michael Torres | Updated pricing terms |
| 3 days ago | Sarah Chen | Uploaded insurance certificate |
| 5 days ago | Michael Torres | Commented: "Can we discuss delivery window flexibility?" |
| 1 week ago | Sarah Chen | Accepted volume terms |
| 1 week ago | System | Deal moved to Negotiation stage |
| 2 weeks ago | Michael Torres | Invited GreenGrow Biomass Co |
| 2 weeks ago | Michael Torres | Created deal room |

### CommentInput

| Element | Content |
|---------|---------|
| **Placeholder** | Add a comment... |
| **CTA** | Send |

### Empty State — No Activity

| Element | Content |
|---------|---------|
| **Title** | No activity yet |
| **Description** | Activity will appear here as you and your counterparty progress the deal. |

---

## 9) Role-Based Behavior

### Grower View Differences

| Element | Grower sees |
|---------|-------------|
| **Primary action** | Upload evidence |
| **Secondary action** | Respond to terms |
| **PartyCard position** | Own card first |
| **Terms editing** | Can accept/reject, propose changes |
| **Evidence upload** | Full upload access |

### Developer View Differences

| Element | Developer sees |
|---------|---------------|
| **Primary action** | Propose terms |
| **Secondary action** | Request evidence |
| **PartyCard position** | Own card first |
| **Terms editing** | Can propose, accept/reject |
| **Evidence upload** | Limited to buyer-side docs |

### Lender View (Read-Only)

| Element | Lender sees |
|---------|-------------|
| **Primary action** | Export summary |
| **Terms editing** | View only |
| **Evidence** | View only |
| **Activity** | View only |
| **Badge** | "Observer" role indicator |

---

## 10) ExplainerCarousel — Deal Room (3 Panels)

### Panel 1

| Element | Content |
|---------|---------|
| **Title** | How deal rooms work |
| **Body** | Deal rooms provide a shared workspace where both parties can negotiate terms, upload evidence, and progress toward a binding agreement. |

### Panel 2

| Element | Content |
|---------|---------|
| **Title** | What builds confidence |
| **Body** | Uploading verified evidence, agreeing on terms, and maintaining clear communication all contribute to deal confidence. |

### Panel 3

| Element | Content |
|---------|---------|
| **Title** | Moving to contract |
| **Body** | Once all required evidence is verified and terms are agreed, you can generate a binding agreement for signature. |

---

## 11) Empty & Edge States

### No Deal Rooms

| Element | Content |
|---------|---------|
| **Title** | No deal rooms yet |
| **Description** | Create a deal room to start negotiating terms with a supplier or buyer. |
| **CTA** | Create deal room |

### No Evidence Uploaded

| Element | Content |
|---------|---------|
| **Title** | No evidence uploaded yet |
| **Description** | Evidence builds confidence and unlocks term negotiation. |
| **CTA** | Upload first document |

### No Activity

| Element | Content |
|---------|---------|
| **Title** | No activity yet |
| **Description** | Activity will appear here as you and your counterparty progress the deal. |

### Counterparty Not Joined

| Element | Content |
|---------|---------|
| **Title** | Waiting for counterparty |
| **Description** | Your invitation has been sent. The deal room will activate once they join. |
| **CTA** | Resend invitation |

### All Terms Agreed

| Element | Content |
|---------|---------|
| **Title** | All terms agreed |
| **Description** | You can now generate a binding agreement for signature. |
| **CTA** | Generate contract |

---

## 12) Deal Room States to Build

### State 1: Draft Deal Room

- DealRoomHeader: Draft stage
- Stepper: Step 1 active
- Evidence: 0-1 items
- Terms: All "Proposed" or empty
- Activity: Creation only

### State 2: Active Negotiation

- DealRoomHeader: Negotiation stage
- Stepper: Step 3 active
- Evidence: 4-5 of 6 items
- Terms: Mix of Agreed/Proposed/Under discussion
- Activity: Rich history

### State 3: Pending Agreement

- DealRoomHeader: Agreed stage
- Stepper: Step 4 active
- Evidence: 6 of 6 items (all verified)
- Terms: All "Agreed"
- Activity: Ready for contract generation

### State 4: Contracted

- DealRoomHeader: Contracted stage (success)
- Stepper: All complete
- Banner: "Contract signed [date]"
- Terms: Locked, view only
- Action: View/download contract

---

## 13) Sample Deal Names

| Deal Name | Feedstock | Parties |
|-----------|-----------|---------|
| NT SAF Facility — Bamboo Supply | Bamboo biomass | GreenGrow ↔ NT SAF Holdings |
| QLD Bioethanol — Sugarcane Bagasse | Sugarcane bagasse | Mackay Sugar ↔ QLD Biofuels |
| Gippsland Biomethane — Forestry | Forestry residues | Vic Forestry Co-op ↔ Gippsland Energy |
| SA Green Hydrogen — Wheat Stubble | Wheat stubble | Mallee Growers ↔ SA Hydrogen |
| Brisbane RD — Cotton Gin Trash | Cotton gin trash | Moree Cotton ↔ Brisbane Renewables |

---

## 14) Deal Room-Specific Tone

| Do | Don't |
|----|-------|
| "Deal room" | "Negotiation workspace" |
| "Counterparty" | "Other party" |
| "Evidence builds confidence" | "Documents required" |
| "Propose terms" | "Submit offer" |
| "Terms under discussion" | "Terms disputed" |
| "Move to contract" | "Finalize deal" |
| "Waiting for counterparty" | "Pending response" |

---

## 15) Quick Copy Reference

### Button Labels

- Create deal room
- Open deal room
- View deal room
- Propose terms
- Accept terms
- Request evidence
- Upload evidence
- Send reminder
- Generate contract
- View contract
- Export term sheet
- Resend invitation

### Stage Labels

- Draft
- Shared
- Negotiation
- Agreed
- Contracted

### Status Labels

- Agreed
- Proposed
- Under discussion
- Rejected
- Verified
- Uploaded
- Pending

### Helper Text Patterns

- "In negotiation or pending"
- "Deals waiting on counterparty"
- "Binding agreements in place"
- "Items verified"
- "Based on evidence completeness"
- "Upload and verify documents to build confidence"
- "Activity will appear here as you and your counterparty progress the deal"

---

## 16) Implementation Checklist

- [ ] Create DealRoomHeader component in Figma
- [ ] Create DealProgressStepper component
- [ ] Create DealRoomSummaryCard with all states
- [ ] Create PartyCard component
- [ ] Create TermsCard with field status indicators
- [ ] Create EvidenceChecklist component
- [ ] Create ActivityFeed component
- [ ] Build Deal Room Landing page (list view)
- [ ] Build Deal Room Detail page with 4 tabs
- [ ] Create all empty/edge states
- [ ] Test role-based view differences
- [ ] Verify stage progression flow

---

## 17) Cross-Dashboard Consistency

| Component | Grower Dashboard | Developer Dashboard | Lender Dashboard | Deal Room |
|-----------|------------------|---------------------|------------------|-----------|
| Header style | RoleHeader | RoleHeader | RoleHeader | DealRoomHeader |
| Progress indicator | Linear % | Linear % | Hidden | Stepper |
| KPI tiles | 3 tiles | 3 tiles | 3 tiles | 4 tiles |
| Primary action | Setup-focused | Supply-focused | Review-focused | Negotiation-focused |
| List cards | ListingSummaryCard | ListingSummaryCard | ListingSummaryCard | DealRoomSummaryCard |
| Evidence display | EvidenceProgressCard | — | — | EvidenceChecklist |
| Activity feed | — | — | — | ActivityFeed |

