# ABFI Assurance Pack — Style System A

**Design Philosophy:** Conservative Institutional

---

## 1) Overall Aesthetic

### Design Intent

> Look like it belongs in a credit committee pack, not a pitch deck.

### Descriptors

| Attribute | Purpose |
|-----------|---------|
| Neutral | No bias or emphasis |
| Calm | No urgency or alarm |
| Authoritative | Trusted, professional |
| Print-safe | Works on paper |
| Audit-friendly | Clean for review |

### Avoid

| Element | Why |
|---------|-----|
| Gradients | Looks promotional |
| Illustrations | Distracting |
| Decorative icons | Unnecessary |
| Marketing language | Erodes trust |
| Color-coded emphasis without labels | Accessibility |

---

## 2) Page Format & Layout

### Page Size

| Property | Value |
|----------|-------|
| Format | A4 portrait |
| Margins | 20mm all sides |

### Grid

| Usage | Columns |
|-------|---------|
| Body content | Single-column |
| Contract snapshot tables | Two-column (optional) |
| Evidence tables | Two-column (optional) |

### Page Footer (Every Page)

| Position | Content |
|----------|---------|
| **Left** | ABFI Assurance Summary — Confidential |
| **Center** | Contract ID: XXXX-XXXX |
| **Right** | Generated: YYYY-MM-DD |

**Style:** Small, neutral grey text.

---

## 3) Typography (Print-First)

### Primary Font

| Font | Fallback |
|------|----------|
| **Inter** | System equivalent |

*Chosen for legibility, neutrality, and regulatory acceptance.*

### Type Scale

| Usage | Size | Weight | Case |
|-------|------|--------|------|
| Document title | 22–24 pt | Semibold | Title Case |
| Section headers | 13–14 pt | Semibold | Sentence case |
| Body text | 10.5–11 pt | Regular | Sentence case |
| Table headers | 9.5–10 pt | Medium | Sentence case |
| Footnotes | 8 pt | Regular | Sentence case |
| Labels / meta | 9 pt | Medium | Sentence case |

### Typography Rules

| Rule | Specification |
|------|---------------|
| All-caps headers | ❌ Never |
| Condensed fonts | ❌ Never |
| Line height | ≥ 1.4× |
| Paragraph spacing | 8–12 pt |

---

## 4) Color System (Grayscale + One Accent)

### Primary Palette

| Usage | Color |
|-------|-------|
| **Text** | Near-black (#111 / #222) |
| **Secondary text** | Neutral grey (#666) |
| **Lines/dividers** | Light grey (#DDD) |
| **Background** | White only (#FFF) |

### Accent Color (Used Sparingly)

| Status | Color | Usage Rule |
|--------|-------|------------|
| Positive/Confirmed | Muted institutional green | Only for confirmed positive status |
| Attention | Amber | Only when paired with text label |
| Blocking issue | Red | Only with explicit label |

### Grayscale Rule

> If printed in black & white, the document must still be fully understandable.

All status indicators must have text labels, not rely on color alone.

---

## 5) Component Styling (Export-Specific)

### Section Headers

| Property | Specification |
|----------|---------------|
| Alignment | Left-aligned |
| Divider | Thin line below |
| Icons | None |

**Example:**
```
Bankability & Confidence Summary
──────────────────────────────────────
```

### Score Presentation (Critical)

**Do NOT use:**
- Circular gauges
- Dials
- Progress rings
- Colored bars

**Use this format:**

```
BANKABILITY ASSESSMENT

Good — Suitable for commercial execution with standard monitoring

Score: 76 (if enabled)
Confidence: High
Based on evidence completeness and verification depth.
```

| Element | Format |
|---------|--------|
| Assessment label | Bold |
| Band + explanation | Regular, em-dash separator |
| Numerical score | Below, if enabled |
| Confidence level | High / Medium / Low |
| Explanation | 2 lines max |

### Tables

| Property | Specification |
|----------|---------------|
| Rules | Horizontal only |
| Zebra striping | ❌ None |
| Background shading | Only for headers |

| Alignment | Usage |
|-----------|-------|
| Text | Left-aligned |
| Numbers | Right-aligned |
| Dates | Consistent (YYYY-MM-DD) |

**Example Table:**

```
Evidence Type          Status      Last Updated    Valid Until
────────────────────────────────────────────────────────────────
Sustainability cert    Verified    2024-11-02      2026-11-02
Quality testing        Verified    2025-02-10      2026-02-10
Insurance              Expiring    2025-06-01      2025-07-01
```

### Alerts / Flags

**Rendered as boxed text, not colored panels.**

**Example:**
```
┌─────────────────────────────────────────────────────────────┐
│  Attention required                                         │
│  One document will expire within 30 days and requires       │
│  update.                                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 6) Iconography

### Default Policy

> None.

### If Icons Are Required

| Rule | Specification |
|------|---------------|
| Style | Monochrome only |
| Limit | 1 per section max |
| Allowed uses | Status (✓ / ! / ×), Navigation anchors (rare) |

**No illustrative icons.**

### Status Icons

| Status | Icon | Text Accompaniment |
|--------|------|-------------------|
| Verified/Pass | ✓ | Always paired with label |
| Attention | ! | Always paired with label |
| Failed/Blocked | × | Always paired with label |

---

## 7) Logo & Brand Usage

### ABFI Logo

| Placement | Usage |
|-----------|-------|
| Cover page | Yes (header or footer) |
| Document footer | Yes (small) |
| Body pages | No |

### Partner Logos

| Rule | Specification |
|------|---------------|
| Usage | Optional |
| Approval | Only if explicitly approved |
| Size | Must not dominate |
| Implication | Must not imply endorsement |

---

## 8) Language & Tone Rules (Non-Negotiable)

### Use These Words

| Word/Phrase | Context |
|-------------|---------|
| "Indicates" | When describing data |
| "Based on available evidence" | Qualifying statements |
| "As of the issue date" | Time-bound claims |
| "Monitoring indicates" | Signal descriptions |
| "Suggests" | Interpretive findings |
| "May require" | Recommended actions |

### Avoid These Words

| Word/Phrase | Why |
|-------------|-----|
| "Guarantees" | Legal liability |
| "Ensures" | Overpromising |
| "Optimised" | Marketing speak |
| "Best-in-class" | Subjective claim |
| "Industry-leading" | Unverifiable |
| "Revolutionary" | Hyperbole |
| "Seamless" | Marketing speak |

> This keeps the document legally safe.

---

## 9) Figma Implementation Checklist (Style A)

### Figma Page Location

```
Exports / AssurancePack / Style-A
```

### Components to Create

| Component | Description |
|-----------|-------------|
| A4 page template | Base template with margins and footer |
| Section header component | Left-aligned with divider |
| Table component (export version) | Horizontal rules only |
| Alert box component | Boxed text style |
| Score summary block | Text-based, no gauges |

### Text Styles to Create

| Style Name | Usage |
|------------|-------|
| Export/Title | Document title (22-24pt) |
| Export/Section | Section headers (13-14pt) |
| Export/Body | Body text (10.5-11pt) |
| Export/Table/Header | Table headers (9.5-10pt) |
| Export/Table/Cell | Table content (10.5pt) |
| Export/Footnote | Footnotes (8pt) |
| Export/Label | Meta labels (9pt) |

### Color Styles to Create

| Style Name | Value | Usage |
|------------|-------|-------|
| Export/Text/Primary | #111111 | Main text |
| Export/Text/Secondary | #666666 | Secondary text |
| Export/Divider | #DDDDDD | Lines, borders |
| Export/Background | #FFFFFF | Page background |
| Export/Status/Positive | Muted green | Verified status |
| Export/Status/Attention | Muted amber | Warning status |
| Export/Status/Critical | Muted red | Error status |

---

## 10) Why Style A Is The Right Default

### Trust Signals

| Property | Benefit |
|----------|---------|
| Survives legal review | No risky claims |
| Passes credit committee scrutiny | Professional format |
| Doesn't age poorly | Timeless design |
| Transfers cleanly | PDF, DOCX, print all work |
| Signals infrastructure seriousness | Looks like a real system |

### The Ultimate Test

> If someone prints it, highlights it, or forwards it to Treasury — it still holds.

---

## 11) Print Specifications

### PDF Export Settings

| Setting | Value |
|---------|-------|
| Page size | A4 (210 × 297 mm) |
| Color mode | CMYK for print, RGB for screen |
| Resolution | 300 DPI minimum |
| Fonts | Embedded |
| Compression | Lossless |

### Grayscale Test

Before finalizing any design:
1. Convert to grayscale
2. Print on standard office printer
3. Verify all content is readable
4. Verify all status indicators are clear

---

## 12) Component Specifications

### Cover Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      [ABFI LOGO]                            │
│                                                             │
│                                                             │
│              ABFI Assurance Summary                         │
│                                                             │
│                                                             │
│         NT SAF Facility — Bamboo Supply                     │
│                                                             │
│              Contract ID: CTR-2024-0847                     │
│                                                             │
│                                                             │
│         ─────────────────────────────────                   │
│                                                             │
│         Supplier:   GreenGrow Biomass Co                    │
│         Buyer:      NT SAF Holdings                         │
│         Lender:     Australian Clean Energy Finance         │
│                                                             │
│         Status:     Active                                  │
│         Issued:     15 May 2025                             │
│                                                             │
│                                                             │
│                                                             │
│─────────────────────────────────────────────────────────────│
│  This document is generated by ABFI using verified data     │
│  supplied by counterparties. It does not constitute         │
│  financial advice.                                          │
└─────────────────────────────────────────────────────────────┘
```

### Section Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Bankability & Confidence Summary                           │
│  ─────────────────────────────────────────────────────      │
│                                                             │
│  BANKABILITY ASSESSMENT                                     │
│                                                             │
│  Good — Suitable for commercial execution with              │
│  standard monitoring.                                       │
│                                                             │
│  Score: 76                                                  │
│  Confidence: High                                           │
│                                                             │
│  Based on evidence completeness (92%) and full              │
│  third-party verification.                                  │
│                                                             │
│                                                             │
│  POSITIVE INDICATORS                                        │
│                                                             │
│  • Verified production capacity                             │
│  • Geographic consistency confirmed                         │
│  • Strong counterparty credit profile                       │
│                                                             │
│                                                             │
│  RISK INDICATORS                                            │
│                                                             │
│  • Seasonal variability in supply volumes                   │
│  • Logistics documentation pending update                   │
│                                                             │
│                                                             │
│─────────────────────────────────────────────────────────────│
│ ABFI Assurance — Confidential │ CTR-2024-0847 │ 2025-05-15 │
└─────────────────────────────────────────────────────────────┘
```

### Table Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Evidence & Verification Status                             │
│  ─────────────────────────────────────────────────────      │
│                                                             │
│  EVIDENCE SUMMARY                                           │
│                                                             │
│  Evidence Type              Status    Updated     Valid     │
│  ──────────────────────────────────────────────────────     │
│  Sustainability certificate Verified  2024-11-02  2026-11   │
│  Quality testing            Verified  2025-02-10  2026-02   │
│  Insurance                  Expiring  2025-06-01  2025-07   │
│  Production capacity proof  Verified  2024-12-15  2025-12   │
│  Property boundary          Verified  2024-10-20  —         │
│                                                             │
│                                                             │
│  ┌───────────────────────────────────────────────────┐      │
│  │ Attention required                                │      │
│  │ One document will expire within 30 days and       │      │
│  │ requires update.                                  │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│                                                             │
│  Summary: All required evidence is present. One item        │
│  requires renewal within 30 days.                           │
│                                                             │
│─────────────────────────────────────────────────────────────│
│ ABFI Assurance — Confidential │ CTR-2024-0847 │ 2025-05-15 │
└─────────────────────────────────────────────────────────────┘
```

---

## 13) Quality Checklist

Before exporting any Assurance Pack:

- [ ] All text is legible at 100% zoom
- [ ] No color-only indicators (all have text labels)
- [ ] Footer appears on every page
- [ ] Contract ID is consistent throughout
- [ ] Timestamp is accurate
- [ ] No marketing language present
- [ ] Tables fit within margins
- [ ] Grayscale version is readable
- [ ] All fonts are embedded
- [ ] Legal disclaimer is present

