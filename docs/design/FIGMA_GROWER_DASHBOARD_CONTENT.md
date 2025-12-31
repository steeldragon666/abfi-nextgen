# Grower Dashboard — v1 Content Pack

**Design Option:** Option A · Grower-first · Enterprise-clean

---

## 1) RoleHeader — Grower

### State A — New / Incomplete Grower (Default First-Time View)

| Element | Content |
|---------|---------|
| **Title** | Grower Dashboard |
| **Status chip label** | Profile incomplete |
| **Status chip tone** | `warning` |
| **Progress value** | 45% |
| **Progress label** | Complete 2 more steps to become visible to buyers |
| **Primary action** | Continue setup |
| **Secondary link** | How scoring works |
| **Help link** | Get help |

### State B — Ready & Active Grower

| Element | Content |
|---------|---------|
| **Title** | Grower Dashboard |
| **Status chip label** | Ready to receive inquiries |
| **Status chip tone** | `success` |
| **Progress value** | 100% |
| **Progress label** | Your profile meets minimum visibility requirements |
| **Primary action** | Create a listing |
| **Secondary link** | How buyers find you |

### State C — Action Required

| Element | Content |
|---------|---------|
| **Title** | Grower Dashboard |
| **Status chip label** | Action required |
| **Status chip tone** | `risk` |
| **Progress value** | 78% |
| **Progress label** | One item needs attention to maintain visibility |
| **Primary action** | View required action |

---

## 2) NextStepCard — "Your next best step"

### Variant A — Property Details Missing

| Element | Content |
|---------|---------|
| **Title** | Your next best step |
| **Body** | Add your property details so buyers can see where your feedstock is produced. |
| **Primary CTA** | Add property details |
| **Microcopy** | Takes about 3 minutes |
| **Checklist item 1** | Property boundary — ⏳ |
| **Checklist item 2** | Production profile — ⏳ |
| **Checklist item 3** | Certificates — ⏳ |

### Variant B — Evidence Incomplete

| Element | Content |
|---------|---------|
| **Title** | Your next best step |
| **Body** | Upload at least one supporting document to improve confidence and eligibility. |
| **Primary CTA** | Upload evidence |
| **Checklist item 1** | Quality test — ⏳ |
| **Checklist item 2** | Sustainability certificate — ⏳ |
| **Checklist item 3** | Production capacity proof — ✅ |

### Variant C — All Steps Complete

| Element | Content |
|---------|---------|
| **Title** | Your next best step |
| **Body** | You've completed all recommended setup steps. |
| **Primary CTA** | Create your first listing |
| **Checklist item 1** | Property boundary — ✅ |
| **Checklist item 2** | Production profile — ✅ |
| **Checklist item 3** | Certificates — ✅ |

---

## 3) KPI Tiles (StatsGrid · 3 Tiles Only)

### Tile 1 — Visibility

| Element | Content |
|---------|---------|
| **Label** | Visibility |
| **Value** | Standard |
| **Helper** | How often buyers can find you |
| **Delta** | ↑ improving |
| **Action link** | Improve visibility |

### Tile 2 — Confidence

| Element | Content |
|---------|---------|
| **Label** | Confidence |
| **Value** | Medium |
| **Helper** | Based on completeness of evidence |
| **Action link** | Add evidence |

### Tile 3 — Inquiries

| Element | Content |
|---------|---------|
| **Label** | Buyer inquiries |
| **Value** | 2 open |
| **Helper** | Requests awaiting your response |
| **Action link** | View inquiries |

---

## 4) Listings Section

### SectionHeader

| Element | Content |
|---------|---------|
| **Title** | Your listings |
| **Action** | Create listing (secondary button) |

### ListingSummaryCard — Draft

| Element | Content |
|---------|---------|
| **Listing name** | Sugarcane bagasse — North QLD |
| **Status** | Draft |
| **Feedstock** | Sugarcane bagasse |
| **Availability** | Not set |
| **Score** | Not yet rated |
| **Primary action** | Edit |
| **Secondary action** | View |

### ListingSummaryCard — Pending Verification

| Element | Content |
|---------|---------|
| **Listing name** | (Use realistic name) |
| **Status** | Pending verification |
| **Score** | Good (72) |
| **Primary action** | Edit |
| **Secondary action** | View |

### ListingSummaryCard — Live

| Element | Content |
|---------|---------|
| **Listing name** | (Use realistic name) |
| **Status** | Live |
| **Score** | Good (78) |
| **Availability** | Jan–Mar 2026 |
| **Primary action** | View |
| **Secondary action** | Edit |

### Empty State — No Listings

| Element | Content |
|---------|---------|
| **Title** | You don't have any listings yet |
| **Description** | Create a listing to let buyers know what feedstock you can supply. |
| **CTA** | Create your first listing |

---

## 5) Evidence & Certificates Card

### Default (Medium Completion)

| Element | Content |
|---------|---------|
| **Title** | Evidence & certificates |
| **Helper line** | More evidence increases buyer confidence and bankability. |
| **Progress label** | 2 of 5 recommended items added |
| **Progress value** | 40% |
| **Checklist item 1** | Sustainability certificate — ⏳ |
| **Checklist item 2** | Quality test result — ⏳ |
| **Checklist item 3** | Production capacity proof — ✅ |
| **Checklist item 4** | Property boundary — ✅ |
| **Checklist item 5** | Insurance / compliance — ⏳ |
| **Primary CTA** | Upload certificate |
| **Secondary link** | Why this matters |

### High Completion Variant

| Element | Content |
|---------|---------|
| **Progress label** | 5 of 5 recommended items added |
| **Progress value** | 100% |
| **Helper** | Your evidence meets best-practice expectations. |
| **CTA** | View evidence |

---

## 6) Biomass Map Card

| Element | Content |
|---------|---------|
| **Title** | Your properties |
| **Subtitle** | Adding boundaries improves visibility and confidence |
| **CTA overlay** | Add your property |
| **Legend item 1** | Your property |
| **Legend item 2** | Nearby buyers |
| **Legend item 3** | Supply region |

---

## 7) ExplainerCarousel — Grower Onboarding (3 Panels)

### Panel 1

| Element | Content |
|---------|---------|
| **Title** | How buyers find you |
| **Body** | Buyers search by feedstock type, location, and availability. Complete profiles appear more often. |

### Panel 2

| Element | Content |
|---------|---------|
| **Title** | What improves your score |
| **Body** | Adding evidence and accurate production details improves confidence and eligibility. |

### Panel 3

| Element | Content |
|---------|---------|
| **Title** | What to do next |
| **Body** | Complete your setup, create a listing, and respond promptly to buyer inquiries. |

---

## 8) System Empty & Error States (Grower Tone)

### No Inquiries

| Element | Content |
|---------|---------|
| **Title** | No inquiries yet |
| **Description** | Once your listing is live, buyer inquiries will appear here. |
| **CTA** | View listing visibility |

### Missing Evidence (Blocking)

| Element | Content |
|---------|---------|
| **Title** | Evidence required |
| **Description** | At least one document is needed to remain visible to buyers. |
| **CTA** | Upload evidence |

### Error State (Generic, Non-Technical)

| Element | Content |
|---------|---------|
| **Title** | Something didn't load |
| **Description** | Please refresh the page or try again in a moment. |
| **CTA** | Retry |
| **Secondary link** | Contact support |

---

## 9) Default Data Assumptions (For Realistic Figma Mockups)

Use these consistently across screens:

| Data Point | Values |
|------------|--------|
| **Completion %** | 45%, 78%, or 100% (never 0%) |
| **Scores** | 68–82 range (avoid extremes) |
| **Listings per grower** | 1–3 |
| **Inquiries** | 0–3 open |
| **Certificates** | 2–4 typical |

---

## Grower Dashboard States to Build

### State 1: New Grower
- RoleHeader: State A (incomplete, 45%)
- NextStepCard: Variant A (property details)
- KPI Tiles: Low values, no delta
- Listings: Empty state
- Evidence: 1 of 5 complete

### State 2: Active Grower
- RoleHeader: State B (ready, 100%)
- NextStepCard: Variant C (all complete)
- KPI Tiles: Standard values with deltas
- Listings: 2-3 cards (mix of statuses)
- Evidence: 4 of 5 complete

### State 3: Action Required Grower
- RoleHeader: State C (action required, 78%)
- NextStepCard: Variant B (evidence incomplete)
- KPI Tiles: Warning on one tile
- Listings: 1-2 cards
- Evidence: 2 of 5 complete

---

## Sample Realistic Listing Names

Use these for mockups:

| Name | Feedstock | Region |
|------|-----------|--------|
| Sugarcane bagasse — North QLD | Sugarcane bagasse | Queensland |
| Wheat stubble — Darling Downs | Wheat stubble | Queensland |
| Canola straw — NSW Riverina | Canola straw | New South Wales |
| Cotton gin trash — Moree | Cotton gin trash | New South Wales |
| Barley straw — SA Mallee | Barley straw | South Australia |
| Forestry residues — Gippsland | Forestry residues | Victoria |

---

## Tone Guidelines (Grower-First)

| Do | Don't |
|----|-------|
| "Complete your setup" | "Your profile is incomplete" |
| "Add evidence" | "Missing required documents" |
| "Improve visibility" | "Low visibility score" |
| "Ready to receive inquiries" | "Profile activated" |
| "Takes about 3 minutes" | "Estimated completion time: 3 min" |
| "How buyers find you" | "Search algorithm optimization" |

---

## Quick Copy Reference

### Button Labels
- Continue setup
- Create a listing
- Add property details
- Upload evidence
- Upload certificate
- View inquiries
- Edit
- View
- Retry

### Status Labels
- Profile incomplete
- Ready to receive inquiries
- Action required
- Draft
- Pending verification
- Live

### Helper Text Patterns
- "How often buyers can find you"
- "Based on completeness of evidence"
- "Requests awaiting your response"
- "More evidence increases buyer confidence and bankability"
- "Adding boundaries improves visibility and confidence"

---

## Implementation Checklist

- [ ] Drop content into Figma component text layers
- [ ] Create 3 dashboard states (New, Active, Action Required)
- [ ] Verify all copy fits within character limits
- [ ] Test all status chip tones render correctly
- [ ] Check progress bar values match percentages
- [ ] Ensure empty states have appropriate CTAs
