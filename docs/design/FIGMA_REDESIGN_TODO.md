# ABFI Platform — Figma Redesign TODO

**File Name:** `ABFI Platform — DS & Product UI (Grower-First) v3.0`
**Design Philosophy:** Grower-first, Enterprise-clean
**Primary User:** Growers / Producers (non-technical, time-poor)

---

## PAGE 00 — COVER

### Frames to Create
- [ ] **Cover Frame**
  - [ ] Title: "ABFI Platform — Design System"
  - [ ] Subtitle: "Grower-First, Enterprise-Grade"
  - [ ] Version: v3.0
  - [ ] Links: Repo, Staging, Figma owner

- [ ] **Design Principles Frame**
  - [ ] Grower clarity beats data density
  - [ ] One primary action per screen
  - [ ] Plain-English before metrics
  - [ ] Evidence always explainable
  - [ ] Never punish incomplete data

- [ ] **Audience Map Frame**
  - [ ] Primary: Growers / Producers
  - [ ] Secondary: Developers
  - [ ] Tertiary: Financiers / Regulators

- [ ] **Navigation Model Frame**
  - [ ] Role-based navigation diagram

---

## PAGE 01 — TOKENS

### Frame 1: Color Variables
- [ ] Create Figma Variables:
  - [ ] `neutral.0` → `neutral.900`
  - [ ] `brand.primary`
  - [ ] `status.success` (green — success only)
  - [ ] `status.warning` (amber — needs input)
  - [ ] `status.risk` (red — blocking issue)
  - [ ] `status.info` (muted blue)
  - [ ] `accent.link`
  - [ ] `surface.1` → `surface.4`

### Frame 2: Typography Styles
- [ ] Create text styles:
  - [ ] Display / H1
  - [ ] Heading / H2
  - [ ] Heading / H3
  - [ ] Body / Large
  - [ ] Body / Default (slightly larger than typical SaaS)
  - [ ] Body / Small
  - [ ] Label / Default
  - [ ] Mono / Code

### Frame 3: Spacing & Radius
- [ ] Document spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 40
- [ ] Document radius scale: 8 / 12 / 16
- [ ] Stroke: 1px neutral

### Frame 4: Data-Viz Tokens
- [ ] Chart color palette (maps to `ui/chart.tsx`)
- [ ] Score band colors

---

## PAGE 02 — FOUNDATIONS

### Frame 1: Grid System
- [ ] Desktop: 12-col, max width 1200–1280px
- [ ] Tablet: 8-col
- [ ] Mobile: 4-col

### Frame 2: Layout Breakpoints
- [ ] Document breakpoint values

### Frame 3: Icon Rules
- [ ] Size standards
- [ ] Stroke weights
- [ ] Usage guidelines

### Frame 4: Motion Rules
- [ ] Hover: 120–150ms
- [ ] Drawers/modals: 220–280ms
- [ ] No bouncing / easing theatrics
- [ ] Maps to `ui/motion.tsx`

---

## PAGE 03 — COMPONENTS (UI KIT)

> Maps 1:1 to `client/src/components/ui/`

### Section 03A — Actions
- [ ] **Button**
  - [ ] Variants: Primary / Secondary / Ghost / Destructive
  - [ ] States: default / hover / disabled / loading
  - [ ] Sizes: sm / md / lg
  - [ ] Maps to: `ui/button.tsx`
- [ ] **ButtonGroup** → `ui/button-group.tsx`
- [ ] **Toggle** → `ui/toggle.tsx`
- [ ] **ToggleGroup** → `ui/toggle-group.tsx`

### Section 03B — Inputs
- [ ] **Input** (with label, helper text, error state) → `ui/input.tsx`
- [ ] **Textarea** → `ui/textarea.tsx`
- [ ] **Select** → `ui/select.tsx`
- [ ] **Checkbox** → `ui/checkbox.tsx`
- [ ] **RadioGroup** → `ui/radio-group.tsx`
- [ ] **Slider** → `ui/slider.tsx`
- [ ] **Switch** → `ui/switch.tsx`
- [ ] **Calendar** → `ui/calendar.tsx`
- [ ] **Form / Field / InputGroup** → `ui/form.tsx`, `ui/field.tsx`, `ui/input-group.tsx`

### Section 03C — Navigation
- [ ] **Sidebar** (expanded only — no icon-only for growers) → `ui/sidebar.tsx`
- [ ] **Breadcrumb** → `ui/breadcrumb.tsx`
- [ ] **NavigationMenu** → `ui/navigation-menu.tsx`
- [ ] **Menubar** → `ui/menubar.tsx`
- [ ] **Pagination** → `ui/pagination.tsx`
- [ ] **Tabs** (underline style only) → `ui/tabs.tsx`

### Section 03D — Surfaces
- [ ] **Card** (default / outlined / elevated) → `ui/card.tsx`
- [ ] **Separator** → `ui/separator.tsx`
- [ ] **ScrollArea** → `ui/scroll-area.tsx`
- [ ] **Resizable** → `ui/resizable.tsx`
- [ ] **Collapsible** → `ui/collapsible.tsx`

### Section 03E — Overlays
- [ ] **Dialog** → `ui/dialog.tsx`
- [ ] **Drawer** → `ui/drawer.tsx`
- [ ] **Sheet** → `ui/sheet.tsx`
- [ ] **Popover** → `ui/popover.tsx`
- [ ] **HoverCard** → `ui/hover-card.tsx`
- [ ] **Tooltip** → `ui/tooltip.tsx`
- [ ] **ContextMenu** → `ui/context-menu.tsx`
- [ ] **DropdownMenu** → `ui/dropdown-menu.tsx`

### Section 03F — Feedback
- [ ] **Alert** (info / warning / error) → `ui/alert.tsx`
- [ ] **Toast (Sonner)** → `ui/sonner.tsx`
- [ ] **Spinner** → `ui/spinner.tsx`
- [ ] **Skeleton** → `ui/skeleton.tsx`
- [ ] **Empty State** → `ui/empty.tsx`
- [ ] **Progress** → `ui/progress.tsx`

---

## PAGE 04 — COMPONENTS (ABFI DOMAIN)

> Maps to `client/src/components/*.tsx` (non-ui folder)

### Component 1: App Shell
- [ ] Based on: `AppLayout.tsx`
- [ ] Slots: Sidebar, Topbar, PageContainer
- [ ] Sidebar labels always visible (no icon-only)

### Component 2: Dashboard Shell
- [ ] Based on: `DashboardLayout.tsx`
- [ ] KPIs + next steps at top
- [ ] Skeleton variant: `DashboardLayoutSkeleton.tsx`

### Component 3: Page Header
- [ ] Based on: `layout/PageHeader.tsx`
- [ ] Must include: Page title, One-line explanation, ONE primary CTA only

### Component 4: Section Header
- [ ] Based on: `layout/SectionHeader.tsx`
- [ ] Always include helper text

### Component 5: Page Container
- [ ] Based on: `layout/PageContainer.tsx`
- [ ] Standard padding/max width

### Component 6: Page Layout
- [ ] Based on: `layout/PageLayout.tsx`
- [ ] Compose header + container + sections

### Component 7: Stats Grid
- [ ] Based on: `layout/StatsGrid.tsx`
- [ ] KPI tile grid pattern

### Component 8: Page Footer
- [ ] Based on: `layout/PageFooter.tsx`
- [ ] Marketing / legal footer

### Component 9: Role Header
- [ ] Based on: `RoleHeader.tsx`
- [ ] Grower variant includes:
  - [ ] Status summary ("You're nearly ready")
  - [ ] Progress indicator
  - [ ] Next action button

### Component 10: Score System (simplified)
- [ ] Based on: `ScoreCard.tsx`, `ScoreComponents.tsx`
- [ ] Create variants:
  - [ ] **ScoreCard** (label → band → number)
  - [ ] **ScoreBadge** (Excellent / Good / Needs work)
  - [ ] **ConfidenceChip** (High / Medium / Low)
  - [ ] **PillarCard** (icon + 1 sentence)
- [ ] Rule: no more than 3 metrics visible at once

### Component 11: Explainer Carousel
- [ ] Based on: `ExplainerCarousel.tsx`
- [ ] Usage: onboarding, bankability explanations, compliance steps

### Component 12: Map Container
- [ ] Based on: `maps/BiomassMap.tsx`
- [ ] Design: Map frame, Simple legend, Toggle filters (collapsed by default)

### Component 13: AI Chat Box
- [ ] Based on: `AIChatBox.tsx`
- [ ] Optional helper, not core flow
- [ ] "Utility drawer/panel" style

### Component 14: Legal Disclaimer
- [ ] Based on: `LegalDisclaimer.tsx`
- [ ] Collapsible, never blocking
- [ ] "Trust footer panel" style

### Component 15: Location Picker
- [ ] Based on: `LocationPicker.tsx`
- [ ] Step-based, not free-form

### Component 16: Availability Calendar
- [ ] Based on: `AvailabilityCalendar.tsx`

### Component 17: Earnings Calculator
- [ ] Based on: `EarningsCalculator.tsx`

---

## PAGE 05 — PATTERNS

### Pattern 1: Grower Dashboard
- [ ] RoleHeader
- [ ] StatsGrid (3 cards max)
- [ ] "What to do next" card
- [ ] Recent activity list

### Pattern 2: Registration Step
- [ ] Step indicator
- [ ] Single task
- [ ] Primary action
- [ ] Help/explainer panel

### Pattern 3: Marketplace Browse (Grower view)
- [ ] Filters collapsed by default
- [ ] Result cards (not dense tables)
- [ ] "Improve visibility" hint

### Pattern 4: Detail Page
- [ ] Entity header
- [ ] Tabs
- [ ] Summary cards
- [ ] Evidence drawer trigger

### Pattern 5: Data Table Pattern
- [ ] Header row (title + filters + actions)
- [ ] Table body
- [ ] Pagination
- [ ] Empty state
- [ ] Skeleton state

### Pattern 6: Onboarding Flow
- [ ] Stepper + Form + Success

---

## PAGE 06 — TEMPLATES

- [ ] **T-Dashboard (Grower)** → GrowerDashboard
- [ ] **T-Dashboard (Developer)** → DeveloperDashboard
- [ ] **T-Dashboard (Finance)** → FinanceDashboard
- [ ] **T-Dashboard (Admin)** → AdminDashboard
- [ ] **T-Registration Flow** → ProducerRegistration*, Qualification*
- [ ] **T-Detail View** → FeedstockDetail, SupplierProfile
- [ ] **T-Compliance** → CertificateVerification, AuditLogs
- [ ] **T-Marketplace** → Browse, FuturesMarketplace

---

## PAGE 07 — SCREENS (CORE APP)

> Build these first — they anchor the entire platform

### Priority 1: Grower Journey (MUST BUILD)
- [ ] **Grower Dashboard** → `pages/GrowerDashboard.tsx`
- [ ] **Producer Registration Step 1** → `pages/ProducerRegistration.tsx`
- [ ] **Producer Registration Step 2**
- [ ] **Producer Registration Step 3**
- [ ] **Feedstock Create** → `pages/FeedstockCreate.tsx`
- [ ] **Feedstock Detail (simplified)** → `pages/FeedstockDetail.tsx`
- [ ] **Grower Qualification Status** → `pages/GrowerQualification.tsx`
- [ ] **Certificate Upload** → `pages/CertificateUpload.tsx`
- [ ] **Compliance Dashboard** → `pages/ComplianceDashboard.tsx`
- [ ] **Bankability Summary** → `pages/BankabilityDashboard.tsx`
- [ ] **Success / Next Steps** → `pages/ProducerRegistrationSuccess.tsx`

### Priority 2: Core Dashboards
- [ ] **Dashboard (generic)** → `pages/Dashboard.tsx`
- [ ] **Developer Dashboard** → `pages/DeveloperDashboard.tsx`
- [ ] **Finance Dashboard** → `pages/FinanceDashboard.tsx`
- [ ] **Admin Dashboard** → `pages/AdminDashboard.tsx`

### Priority 3: Marketplace & Feedstock
- [ ] **Explore** → `pages/Explore.tsx`
- [ ] **Browse** → `pages/Browse.tsx`
- [ ] **Feedstock Map** → `pages/FeedstockMap.tsx`
- [ ] **Feedstock Edit** → `pages/FeedstockEdit.tsx`

### Priority 4: Bankability
- [ ] **Bankability Assessment** → `pages/BankabilityAssessment.tsx`
- [ ] **Bankability Ratings** → `pages/BankabilityRatings.tsx`
- [ ] **Bankability Explainer** → `pages/BankabilityExplainer.tsx`
- [ ] **Project Ratings Matrix** → `pages/ProjectRatingsMatrix.tsx`
- [ ] **Project Rating Detail** → `pages/ProjectRatingDetail.tsx`
- [ ] **Carbon Intensity Analysis** → `pages/CarbonIntensityAnalysis.tsx`

### Priority 5: Futures & Marketplace
- [ ] **Futures Marketplace** → `pages/FuturesMarketplace.tsx`
- [ ] **Futures Create** → `pages/FuturesCreate.tsx`
- [ ] **Futures Detail (Buyer)** → `pages/FuturesDetailBuyer.tsx`
- [ ] **Futures Detail (Supplier)** → `pages/FuturesDetailSupplier.tsx`
- [ ] **Browse Demand Signals** → `pages/BrowseDemandSignals.tsx`
- [ ] **Demand Signal Detail** → `pages/DemandSignalDetail.tsx`
- [ ] **Create Demand Signal** → `pages/CreateDemandSignal.tsx`

### Priority 6: Evidence & Intelligence
- [ ] **Evidence Vault Dashboard** → `pages/EvidenceVaultDashboard.tsx`
- [ ] **Evidence Management** → `pages/EvidenceManagement.tsx`
- [ ] **Stealth Discovery** → `pages/StealthDiscovery.tsx`
- [ ] **Lending Sentiment Dashboard** → `pages/LendingSentimentDashboard.tsx`
- [ ] **Feedstock Price Dashboard** → `pages/FeedstockPriceDashboard.tsx`
- [ ] **Policy Carbon Dashboard** → `pages/PolicyCarbonDashboard.tsx`

### Priority 7: Supplier & Buyer Flows
- [ ] **Supplier Profile** → `pages/SupplierProfile.tsx`
- [ ] **Supplier Public Profile** → `pages/SupplierPublicProfile.tsx`
- [ ] **Supplier Feedstocks** → `pages/SupplierFeedstocks.tsx`
- [ ] **Supplier Futures** → `pages/SupplierFutures.tsx`
- [ ] **Supplier Inquiries** → `pages/SupplierInquiries.tsx`
- [ ] **Buyer Profile** → `pages/BuyerProfile.tsx`
- [ ] **Buyer Inquiries** → `pages/BuyerInquiries.tsx`
- [ ] **Send Inquiry** → `pages/SendInquiry.tsx`
- [ ] **Inquiry Response** → `pages/InquiryResponse.tsx`

### Priority 8: Admin & Compliance
- [ ] **Audit Logs** → `pages/AuditLogs.tsx`
- [ ] **Admin Assessor Workflow** → `pages/AdminAssessorWorkflow.tsx`
- [ ] **Admin User Management** → `pages/AdminUserManagement.tsx`
- [ ] **Admin RSIE** → `pages/AdminRSIE.tsx`
- [ ] **Certificate Verification** → `pages/CertificateVerification.tsx`
- [ ] **Credentials Dashboard** → `pages/CredentialsDashboard.tsx`

---

## PAGE 08 — MARKETING & AUTHORITY

- [ ] **Home** → `pages/Home.tsx`
- [ ] **Landing** → `pages/Landing.tsx`
- [ ] **For Developers** → `pages/ForDevelopers.tsx`
- [ ] **For Growers** → `pages/ForGrowers.tsx`
- [ ] **For Lenders** → `pages/ForLenders.tsx`
- [ ] **Platform Features** → `pages/PlatformFeatures.tsx`
- [ ] **Grower Benefits** → `pages/GrowerBenefits.tsx`
- [ ] **Explainers** → `pages/Explainers.tsx`

---

## PAGE 09 — STATES & EDGE CASES

- [ ] **Loading State** (skeleton patterns)
- [ ] **Empty State** → `ui/empty.tsx`
- [ ] **Error Boundary** → `ErrorBoundary.tsx`
- [ ] **Unauthorized / Permission Error**
- [ ] **No Results**
- [ ] **Partial Data / Low Confidence**
- [ ] **Success Confirmation**
- [ ] **Not Found** → `pages/NotFound.tsx`

> Rule: No generic "Sorry" screens — always actionable, human language

---

## PAGE 10 — PROTOTYPES

### Prototype 1: Grower Onboarding → First Listing
- [ ] Registration flow
- [ ] Profile completion
- [ ] First feedstock listing
- [ ] Success celebration

### Prototype 2: Grower Improving Score → Re-submission
- [ ] Score review
- [ ] Improvement guidance
- [ ] Evidence upload
- [ ] Re-assessment

### Prototype 3: Grower Responding to Inquiry
- [ ] Inquiry notification
- [ ] Inquiry details
- [ ] Response form
- [ ] Confirmation

> Each prototype must: Show reassurance, Avoid data overload, End with "What happens next?"

---

## PAGE 99 — ARCHIVE

- [ ] Create archive section for deprecated designs

---

## COMPONENT SPEC CHECKLIST

For each key component, document:
- [ ] Name
- [ ] Variants
- [ ] Component properties (Figma props)
- [ ] Responsive behavior
- [ ] Content rules (max chips, max actions, etc.)

### Key 15 Components to Spec:
1. [ ] AppShell
2. [ ] Topbar
3. [ ] Sidebar
4. [ ] PageHeader
5. [ ] SectionHeader
6. [ ] StatsGrid
7. [ ] Button
8. [ ] Input
9. [ ] Select
10. [ ] Card
11. [ ] Table
12. [ ] Tabs
13. [ ] ScoreCard + PillarCard + ScoreBadge
14. [ ] Evidence Drawer
15. [ ] Empty/Error/Skeleton

---

## COMPLETION TRACKING

| Page | Status | Reviewer | Date |
|------|--------|----------|------|
| 00_Cover | [ ] Not Started | | |
| 01_Tokens | [ ] Not Started | | |
| 02_Foundations | [ ] Not Started | | |
| 03_Components — UI Kit | [ ] Not Started | | |
| 04_Components — ABFI Domain | [ ] Not Started | | |
| 05_Patterns | [ ] Not Started | | |
| 06_Templates | [ ] Not Started | | |
| 07_Screens — Core App | [ ] Not Started | | |
| 08_Screens — Marketing | [ ] Not Started | | |
| 09_States & Edge Cases | [ ] Not Started | | |
| 10_Prototypes | [ ] Not Started | | |

---

## NOTES

- **Grower rule:** Body text slightly larger than typical SaaS
- **Grower rule:** No more than 3 metrics visible at once
- **Grower rule:** Filters collapsed by default
- **Grower rule:** Cards over dense tables
- **Motion rule:** Subtle hover feedback only, no fast transitions
- **Status colors:** Semantic only — never decorative

---

## PAGE 11 — DEAL ROOM

### Deal Room Landing
- [ ] **DealRoomHeader** component
- [ ] **DealProgressStepper** (5 stages: Draft → Shared → Negotiation → Agreed → Contracted)
- [ ] **DealRoomSummaryCard** (Active / Awaiting / Contracted variants)
- [ ] **StatsGrid** (3 tiles: Active Deals, Awaiting Response, Contracted)
- [ ] Empty state: No deal rooms

### Deal Room Detail View
- [ ] **PartyCard** (Grower/Developer/Lender)
- [ ] **DealSummaryCard**
- [ ] **NextStepCard** (deal context variant)
- [ ] Tab navigation: Overview / Evidence / Terms / Activity

### Tab: Evidence
- [ ] **EvidenceChecklist** component
- [ ] **EvidenceUploadCard**
- [ ] Evidence item rows with status

### Tab: Terms
- [ ] **TermsCard** (Volume & Delivery / Pricing / Quality & Compliance)
- [ ] Term status indicators (Agreed / Proposed / Under discussion / Rejected)
- [ ] **TermsActionBar**

### Tab: Activity
- [ ] **ActivityFeed** component
- [ ] **CommentInput**
- [ ] Activity item rows

### Role-Based Views
- [ ] Grower view differences
- [ ] Developer view differences
- [ ] Lender view (read-only)

---

## PAGE 12 — CONTRACTED DASHBOARD

### Contract Overview
- [ ] **PageHeader** (role-based primary actions)
- [ ] **Contract Summary Strip** (horizontal card)
- [ ] **KPI Tiles** — Contract Health (status values, not numbers)

### Delivery & Commitments
- [ ] **Delivery Timeline Card** (list format, not Gantt)
- [ ] Performance notes (Alert component)

### Evidence & Compliance
- [ ] **EvidenceProgressCard** (contract mode)
- [ ] Expiry warning states

### Monitoring & Signals
- [ ] **Risk Signals Card**
- [ ] Monitoring Jobs Summary (optional)

### Activity & Record
- [ ] **ActivityFeed** (read-only audit trail)

### States
- [ ] State 1: Healthy Contract
- [ ] State 2: Attention Required
- [ ] State 3: Issue Detected
- [ ] State 4: Contract Completed

---

## PAGE 13 — EXPORTS & ASSURANCE

### Assurance Pack (Style A — Conservative Institutional)
- [ ] A4 page templates
- [ ] Cover page layout
- [ ] Executive Summary page
- [ ] Contract Snapshot page
- [ ] Bankability & Confidence page
- [ ] Evidence & Verification page
- [ ] Monitoring & Signals page
- [ ] Compliance & Alignment page
- [ ] Activity Snapshot page
- [ ] Disclaimers & Methodology page

### Export Components
- [ ] Section header component (export style)
- [ ] Table component (export style)
- [ ] Alert box component (export style)
- [ ] Score summary block (text-based, no gauges)

### Export Modal
- [ ] Format selection (PDF / DOCX)
- [ ] Scope selection (Summary / Full)
- [ ] Preview info display

### Government Reporting Variant
- [ ] Cover page (gov variant)
- [ ] Public Interest Summary page
- [ ] Supply Assurance Snapshot page
- [ ] Compliance & Standards page
- [ ] Monitoring & Oversight page
- [ ] Disclaimer page (gov variant)
- [ ] Agency selection modal

### Covenant Monitoring Summary
- [ ] Covenant status table
- [ ] Changes detected section
- [ ] Required actions table
- [ ] Statement of record
- [ ] Email template

---

## DOCUMENTATION FILES CREATED

| File | Description | Status |
|------|-------------|--------|
| `FIGMA_REDESIGN_TODO.md` | Master checklist | ✅ Created |
| `FIGMA_REDESIGN_README.md` | Overview & component mapping | ✅ Created |
| `FIGMA_COMPONENT_CONTRACTS.md` | Figma ↔ React prop contracts | ✅ Created |
| `FIGMA_GROWER_DASHBOARD_SPEC.md` | Grower layout specification | ✅ Created |
| `FIGMA_GROWER_COMPONENTS_SPEC.md` | 8 core component specs | ✅ Created |
| `FIGMA_GROWER_DASHBOARD_CONTENT.md` | Grower Dashboard content pack | ✅ Created |
| `FIGMA_DEVELOPER_DASHBOARD_CONTENT.md` | Developer Dashboard content | ✅ Created |
| `FIGMA_LENDER_DASHBOARD_CONTENT.md` | Lender Dashboard content | ✅ Created |
| `FIGMA_DEALROOM_DASHBOARD_CONTENT.md` | Deal Room content pack | ✅ Created |
| `FIGMA_CONTRACTED_DASHBOARD_CONTENT.md` | Contracted Dashboard content | ✅ Created |
| `FIGMA_ASSURANCE_PACK_SPEC.md` | Export specification | ✅ Created |
| `FIGMA_ASSURANCE_PACK_STYLE.md` | Style System A | ✅ Created |
| `FIGMA_EXPORT_VARIANTS_SPEC.md` | Gov/Covenant/Schema specs | ✅ Created |
| `FIGMA_ARENA_CEFC_TEMPLATE_MAPPING.md` | ARENA/CEFC template mapping | ✅ Created |
| `FIGMA_PLATFORM_DESIGN_BRIEF.md` | **Master Design Brief v1.0** | ✅ Created |
| `FIGMA_DESIGN_AUTHORITY_DOCUMENT.md` | **Governance DAD v1.0** | ✅ Created |
| `FIGMA_CHANGE_IMPACT_ASSESSMENT.md` | **PCIA Template v1.0** | ✅ Created |

---

## COMPLETE PLATFORM LIFECYCLE

| Stage | Dashboard | Documentation |
|-------|-----------|---------------|
| Onboarding → Listing | Grower Dashboard | ✅ Complete |
| Supply → Deal | Developer Dashboard | ✅ Complete |
| Bankability → Oversight | Lender Dashboard | ✅ Complete |
| Evaluation → Agreement | Deal Room | ✅ Complete |
| Execution → Assurance | Contracted Dashboard | ✅ Complete |
| Institutional Output | Assurance Pack | ✅ Complete |
| Government Reporting | Gov Export Variant | ✅ Complete |
| Automated Monitoring | Covenant Summary | ✅ Complete |
| API Data | Schema Spec | ✅ Complete |

> This is end-to-end infrastructure documentation, not a UI exercise.
