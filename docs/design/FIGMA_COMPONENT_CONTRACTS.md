# ABFI Platform — Component Prop Contracts (Figma ↔ React)

## Naming Rules (Dev Mode Handoff)

| Figma Concept | React Equivalent |
|---------------|------------------|
| Figma component name | React component name (match where possible) |
| Figma "Variant" | React `variant` prop |
| Figma "Boolean property" | React boolean prop |
| Figma "Text property" | React string prop |
| Figma "Instance swap" | React slot / render prop / `ReactNode` children |

---

## A) Layout Primitives

### AppShell ↔ `components/AppLayout.tsx`

**Figma Component:** `Layout/AppShell`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `navState` | `expanded` \| `collapsed` | `expanded` | Growers always expanded |
| `showBreadcrumbs` | boolean | `true` | |
| `primaryActionLabel` | string | - | |
| `showAIHelper` | boolean | `false` | |

#### React Props Contract
```typescript
interface AppShellProps {
  children: ReactNode;
  sidebarCollapsed?: boolean;
  breadcrumbs?: { label: string; href?: string }[];
  primaryAction?: { label: string; onClick: () => void };
  showAIChat?: boolean;
}
```

> **Note:** If `AppLayout.tsx` doesn't accept these today, create thin wrapper `AppShell.tsx` later. In Figma, model as `AppShell`.

---

### DashboardShell ↔ `components/DashboardLayout.tsx`

**Figma Component:** `Layout/DashboardShell`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `role` | `grower` \| `developer` \| `finance` \| `admin` | `grower` | |
| `kpiDensity` | `low` \| `standard` | `low` | Grower uses `low` |
| `showQuickActions` | boolean | `true` | |

#### React Props Contract
```typescript
interface DashboardShellProps {
  role?: "grower" | "developer" | "finance" | "admin";
  header?: ReactNode;  // Usually RoleHeader
  children: ReactNode;
  loading?: boolean;   // Ties to DashboardLayoutSkeleton
}
```

---

### PageHeader ↔ `components/layout/PageHeader.tsx`

**Figma Component:** `Layout/PageHeader`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `title` | text | - | Required |
| `subtitle` | text | - | 1 line max |
| `hasPrimaryAction` | boolean | `true` | |
| `primaryActionStyle` | `primary` \| `secondary` | `primary` | |
| `hasSecondaryAction` | boolean | `false` | Grower: rare |

#### React Props Contract
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;  // Slot for buttons
}
```

---

### StatsGrid ↔ `components/layout/StatsGrid.tsx`

**Figma Component:** `Pattern/StatsGrid`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `colsDesktop` | `2` \| `3` \| `4` | `3` | Grower: 3 max |
| `showDelta` | boolean | `true` | |
| `density` | `comfortable` \| `compact` | `comfortable` | |

#### React Props Contract
```typescript
interface StatsGridProps {
  children: ReactNode;  // Each child is a StatTile card
  columns?: 2 | 3 | 4;
  density?: "comfortable" | "compact";
}
```

---

## B) Core UI Kit (`components/ui/*`)

### Button ↔ `components/ui/button.tsx`

**Figma Component:** `UI/Button`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `variant` | `primary` \| `secondary` \| `ghost` \| `destructive` | `primary` | |
| `size` | `sm` \| `md` \| `lg` | `md` | |
| `state` | `default` \| `hover` \| `disabled` \| `loading` | `default` | |
| `iconLeft` | boolean | `false` | |
| `iconRight` | boolean | `false` | |
| `label` | text | - | |

#### React Props Contract
```typescript
interface ButtonProps {
  variant?: "default" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  loading?: boolean;  // Add if not present
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
```

> **Note:** Map Figma `primary` → React `default` if that's your theme.

---

### Card ↔ `components/ui/card.tsx`

**Figma Component:** `UI/Card`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `style` | `plain` \| `outlined` \| `elevated` | `plain` | |
| `hasHeader` | boolean | `false` | |
| `hasFooter` | boolean | `false` | |

#### React Contract
Use existing `Card`, `CardHeader`, `CardContent`, `CardFooter` composition.

Style handled by className:
- `plain` → default
- `outlined` → `className="border"`
- `elevated` → `className="shadow-sm"`

---

### Badge ↔ `components/ui/badge.tsx`

**Figma Component:** `UI/Badge`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `tone` | `neutral` \| `success` \| `warning` \| `risk` \| `info` | `neutral` | |
| `size` | `sm` \| `md` | `md` | |
| `label` | text | - | |

#### React Props Contract
```typescript
interface BadgeProps {
  tone?: "neutral" | "success" | "warning" | "risk" | "info";
  children: ReactNode;
}
```

> **Note:** If badge doesn't support semantic tones, add `tone` prop via wrapper.

---

### Tabs ↔ `components/ui/tabs.tsx`

**Figma Component:** `UI/Tabs`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `style` | `underline` | `underline` | Grower default |
| `tabs` | string list | - | |

#### React Contract
Use existing Tabs composition:
```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    ...
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
</Tabs>
```

---

### Table ↔ `components/ui/table.tsx`

**Figma Component:** `UI/DataTable`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `density` | `comfortable` \| `compact` | `comfortable` | |
| `hasRowActions` | boolean | `false` | |
| `hasStatusPills` | boolean | `false` | |
| `emptyState` | boolean | `false` | |
| `loadingState` | boolean | `false` | |

#### React Props Contract (Recommended Pattern)
```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  rowActions?: (row: T) => ReactNode;
  density?: "comfortable" | "compact";
  loading?: boolean;
  empty?: {
    title: string;
    description?: string;
    action?: ReactNode;
  };
}
```

> **Note:** If no `DataTable` component exists, keep as pattern in Figma and implement later.

---

### Drawer / Sheet ↔ `components/ui/drawer.tsx` & `components/ui/sheet.tsx`

**Figma Component:** `UI/EvidenceDrawer`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `side` | `right` \| `left` | `right` | |
| `width` | `sm` \| `md` \| `lg` | `md` | |
| `hasFooterActions` | boolean | `true` | |
| `title` | text | - | |

#### React Props Contract
```typescript
interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}
```

---

### Empty ↔ `components/ui/empty.tsx`

**Figma Component:** `UI/EmptyState`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `type` | `noData` \| `noResults` \| `error` \| `permission` | `noData` | |
| `title` | text | - | |
| `description` | text | - | |
| `hasPrimaryAction` | boolean | `false` | |

#### React Props Contract
```typescript
interface EmptyProps {
  variant?: "noData" | "noResults" | "error" | "permission";
  title: string;
  description?: string;
  action?: ReactNode;
}
```

---

## C) ABFI Domain Components

### RoleHeader ↔ `components/RoleHeader.tsx`

**Figma Component:** `Domain/RoleHeader`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `role` | `grower` \| `developer` \| `finance` | `grower` | |
| `statusText` | text | - | |
| `progressPct` | number | - | 0-100 |
| `primaryActionLabel` | text | - | |
| `showSecondaryAction` | boolean | `false` | |
| `showHelpLink` | boolean | `true` | |

#### React Props Contract
```typescript
interface RoleHeaderProps {
  role: "grower" | "developer" | "finance";
  title: string;  // e.g. "Grower Dashboard"
  status?: {
    label: string;
    tone?: "neutral" | "success" | "warning" | "risk";
  };
  progress?: {
    value: number;  // 0-100
    label?: string;
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  helpLink?: {
    label: string;
    href: string;
  };
}
```

---

### ScoreCard ↔ `components/ScoreCard.tsx`

**Figma Component:** `Domain/ScoreCard`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `score` | number | - | 0-100 |
| `band` | `excellent` \| `good` \| `needsWork` \| `risk` | - | |
| `label` | text | - | e.g. "Overall standing" |
| `meaning` | text | - | e.g. "Good — eligible for inquiries" |
| `confidence` | `high` \| `medium` \| `low` | - | |
| `showDrivers` | boolean | `true` | Grower: max 3 |

#### React Props Contract
```typescript
interface ScoreCardProps {
  label: string;
  score: number;
  band: "excellent" | "good" | "needsWork" | "risk";
  meaning?: string;
  confidence?: "high" | "medium" | "low";
  drivers?: {
    label: string;
    tone?: "success" | "warning" | "risk";
  }[];  // Max 3 visible
  actions?: ReactNode;
}
```

---

### ScoreComponents ↔ `components/ScoreComponents.tsx`

Treat as **set of discrete components** in Figma even if code is consolidated.

#### ScoreBadge
```typescript
interface ScoreBadgeProps {
  score: number;
  band: "excellent" | "good" | "needsWork" | "risk";
  size?: "sm" | "md";
}
```

#### ConfidenceChip
```typescript
interface ConfidenceChipProps {
  level: "high" | "medium" | "low";
  labelOverride?: string;
}
```

#### PillarCard
```typescript
interface PillarCardProps {
  pillarName: string;
  status: "success" | "warning" | "risk" | "neutral";
  oneLiner: string;
  actionLabel?: string;
}
```

---

### ExplainerCarousel ↔ `components/ExplainerCarousel.tsx`

**Figma Component:** `Domain/ExplainerCarousel`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `variant` | `onboarding` \| `bankability` \| `compliance` | `onboarding` | |
| `panelCount` | `3` \| `4` \| `6` | `3` | |
| `showProgressDots` | boolean | `true` | |

#### React Props Contract
```typescript
interface ExplainerCarouselProps {
  variant?: "onboarding" | "bankability" | "compliance";
  items: {
    title: string;
    body: string;
    icon?: ReactNode;
  }[];
}
```

---

### BiomassMap ↔ `components/maps/BiomassMap.tsx`

**Figma Component:** `Domain/BiomassMapContainer`

#### Figma Properties
| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `legendStyle` | `simple` | `simple` | |
| `filtersCollapsed` | boolean | `true` | |
| `showCTAOverlay` | boolean | `true` | "Add your property" |

#### React Props Contract
```typescript
interface BiomassMapProps {
  markers?: any[];
  legend?: { label: string; tone: string }[];
  filters?: ReactNode;
  cta?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## Quick Reference: All Components

| Figma Component | Code File | Category |
|-----------------|-----------|----------|
| Layout/AppShell | `AppLayout.tsx` | Layout |
| Layout/DashboardShell | `DashboardLayout.tsx` | Layout |
| Layout/PageHeader | `layout/PageHeader.tsx` | Layout |
| Pattern/StatsGrid | `layout/StatsGrid.tsx` | Layout |
| UI/Button | `ui/button.tsx` | UI Kit |
| UI/Card | `ui/card.tsx` | UI Kit |
| UI/Badge | `ui/badge.tsx` | UI Kit |
| UI/Tabs | `ui/tabs.tsx` | UI Kit |
| UI/DataTable | `ui/table.tsx` | UI Kit |
| UI/EvidenceDrawer | `ui/drawer.tsx`, `ui/sheet.tsx` | UI Kit |
| UI/EmptyState | `ui/empty.tsx` | UI Kit |
| Domain/RoleHeader | `RoleHeader.tsx` | Domain |
| Domain/ScoreCard | `ScoreCard.tsx` | Domain |
| Domain/ScoreBadge | `ScoreComponents.tsx` | Domain |
| Domain/ConfidenceChip | `ScoreComponents.tsx` | Domain |
| Domain/PillarCard | `ScoreComponents.tsx` | Domain |
| Domain/ExplainerCarousel | `ExplainerCarousel.tsx` | Domain |
| Domain/BiomassMapContainer | `maps/BiomassMap.tsx` | Domain |
