# Code Quality Fixes Implementation Plan

**Created:** 2024-12-21
**Status:** Complete (Phase 1, 2, and 3 done)
**Completed:** 2024-12-21

---

## Overview

This plan addresses issues identified during the comprehensive codebase review, including ESLint errors, code duplication, best practices violations, and performance concerns.

---

## Phase 1: Critical Fixes (Must Fix)

These issues block CI/CD or represent significant code quality problems.

### 1.1 Fix ESLint Errors

**Priority:** Critical
**Status:** [ ] Not Started

#### Task 1.1.1: Fix empty interface errors

**Files:**
- `src/components/ui/command.tsx:24`
- `src/components/ui/textarea.tsx:5`

**Issue:** `@typescript-eslint/no-empty-object-type` - interfaces declaring no members

**Solution:** Replace empty interfaces with type aliases or add explicit members:
```typescript
// Before
interface CommandDialogProps extends DialogProps {}

// After
type CommandDialogProps = DialogProps;
```

#### Task 1.1.2: Fix `as any` usage

**File:** `src/hooks/usePlantsQuery.ts:152`

**Issue:** `@typescript-eslint/no-explicit-any` on `.update({ images: [imageUrl] } as any)`

**Solution:** Create proper type for the update payload:
```typescript
// Define the update type
type PlantImageUpdate = Pick<Database['public']['Tables']['nurserydb']['Update'], 'images'>;

// Use typed update
.update({ images: [imageUrl] } satisfies PlantImageUpdate)
```

#### Task 1.1.3: Fix require() import

**File:** `tailwind.config.ts:105`

**Issue:** `@typescript-eslint/no-require-imports` - require() style import forbidden

**Solution:** Convert to ES module import:
```typescript
// Before
require("tailwindcss-animate")

// After
import tailwindcssAnimate from "tailwindcss-animate"
```

---

### 1.2 Remove Duplicate Toast System

**Priority:** Critical
**Status:** [ ] Not Started

**Issue:** Two toast systems are mounted and used inconsistently:
- shadcn/ui Toast (`useToast` hook) in `PlantDetail.tsx`
- Sonner (`toast` from sonner) in `AddPlant.tsx`

**Decision:** Keep **Sonner** (more modern, simpler API, better defaults)

#### Task 1.2.1: Remove shadcn/ui Toaster

**File:** `src/App.tsx`

```typescript
// Remove this line
import { Toaster } from "@/components/ui/toaster";

// Remove from JSX
<Toaster />
```

#### Task 1.2.2: Migrate PlantDetail.tsx to Sonner

**File:** `src/pages/PlantDetail.tsx`

```typescript
// Before
import { useToast } from "@/hooks/use-toast";
const { toast } = useToast();
toast({ title: "Success", description: "..." });

// After
import { toast } from "sonner";
toast.success("Plant image updated successfully");
toast.error("Failed to update plant image");
```

#### Task 1.2.3: Remove unused toast files

Delete or mark for removal:
- `src/hooks/use-toast.ts`
- `src/components/ui/use-toast.ts`
- `src/components/ui/toast.tsx`
- `src/components/ui/toaster.tsx`

---

### 1.3 Configure QueryClient Defaults

**Priority:** Critical
**Status:** [ ] Not Started

**File:** `src/App.tsx`

**Issue:** QueryClient created without configuration, missing sensible defaults per TanStack Query best practices.

**Solution:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

---

## Phase 2: Code Quality Improvements

These improve maintainability and prevent bugs.

### 2.1 Extract Shared Utility Functions

**Priority:** Medium
**Status:** [x] Completed

#### Task 2.1.1: Create plant-utils.ts

**New File:** `src/lib/plant-utils.ts`

```typescript
/**
 * Get initials from plant name for placeholder display
 */
export function getPlantInitials(
  commonName: string | null,
  scientificName: string | null
): string {
  const name = commonName || scientificName || "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
```

#### Task 2.1.2: Update components to use shared utility

**Files to update:**
- `src/components/PlantCard.tsx` - Remove local `getInitials`, import from utility
- `src/components/plant-detail/PlantHeroImage.tsx` - Remove local `getInitials`, import from utility

---

### 2.2 Fix Memory Leak in PlantHeroImage

**Priority:** Medium
**Status:** [x] Completed

**File:** `src/components/plant-detail/PlantHeroImage.tsx`

**Issue:** `URL.createObjectURL()` creates blob URLs that are never revoked, causing memory leaks.

**Solution:**
```typescript
// Add useEffect to cleanup blob URLs
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

useEffect(() => {
  if (selectedFile) {
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  } else {
    setPreviewUrl(null);
  }
}, [selectedFile]);

// Use previewUrl in the img src instead of inline createObjectURL
```

---

### 2.3 Remove Unused Dependencies

**Priority:** Medium
**Status:** [x] Completed

#### Task 2.3.1: Remove next-themes

**File:** `package.json`

```bash
npm uninstall next-themes
```

**Reason:** This package is for Next.js but the app uses Vite + React Router.

#### Task 2.3.2: Update browserslist

```bash
npx update-browserslist-db@latest
```

---

### 2.4 Enable Stricter TypeScript (Optional)

**Priority:** Low
**Status:** [ ] Not Started

**File:** `tsconfig.json`

**Note:** This may reveal additional type errors that need fixing.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Approach:** Enable one option at a time and fix resulting errors before enabling the next.

---

## Phase 3: Enhancements

These are improvements that enhance user experience and code architecture.

### 3.1 Image Gallery Navigation

**Priority:** Low
**Status:** [x] Completed
**File:** `src/components/plant-detail/PlantHeroImage.tsx`

Added ability to navigate between multiple plant images with:
- Previous/Next navigation buttons
- Dot indicators for direct navigation
- Keyboard navigation (arrow keys)
- Image counter badge showing current/total

### 3.2 Add React Error Boundaries

**Priority:** Low
**Status:** [x] Completed
**New Files:**
- `src/components/ErrorBoundary.tsx` - Error boundary component with retry functionality
- Updated `src/App.tsx` to wrap routes with ErrorBoundary

### 3.3 Code Splitting for Bundle Size

**Priority:** Low
**Status:** [x] Completed
**Files:** Routes in `App.tsx`

Implemented route-based code splitting using `React.lazy()` and `Suspense`:
- All page components are now lazy-loaded
- Added loading spinner fallback component
- Separate chunks generated for each route

### 3.4 Remove Unused shadcn/ui Components

**Priority:** Low
**Status:** [x] Completed
**Directory:** `src/components/ui/`

Removed 34 unused components, keeping only:
- avatar, button, card, dialog, dropdown-menu, form, input, label
- sheet, skeleton, tooltip, MaterialIcon, sonner

Deleted components:
- accordion, alert-dialog, alert, aspect-ratio, badge, breadcrumb, calendar
- carousel, chart, checkbox, collapsible, command, context-menu, drawer
- hover-card, input-otp, menubar, navigation-menu, pagination, popover
- progress, radio-group, resizable, scroll-area, select, separator, sidebar
- slider, switch, table, tabs, textarea, toggle, toggle-group

### 3.5 Dynamic User Data

**Priority:** Low
**Status:** [x] Completed
**Files:**
- `src/contexts/UserContext.tsx` - New user context provider
- `src/components/layout/Header.tsx` - Uses dynamic user data
- `src/pages/Index.tsx` - Uses dynamic user name in greeting
- `src/App.tsx` - Added UserProvider wrapper

Replaced hardcoded "Sarah" with dynamic user data from UserContext. Ready for authentication integration.

### 3.6 Weather API Integration

**Priority:** Low
**Status:** [x] Completed
**Files:**
- `src/hooks/useWeather.ts` - New weather hook using Open-Meteo API
- `src/components/dashboard/WeatherWidget.tsx` - Updated to use real weather data

Features:
- Real-time weather from Open-Meteo API (no API key required)
- Dynamic weather icons based on conditions and time of day
- Loading and error states
- 30-minute cache for API efficiency

---

## Verification Checklist

After completing Phase 1 and 2, verify:

- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run build` completes without errors
- [ ] Bundle size warning addressed or acknowledged
- [ ] All toast notifications work correctly
- [ ] Plant image upload still functions
- [ ] No console errors in browser

---

## File Change Summary

### Phase 1 Files Modified
| File | Change Type |
|------|-------------|
| `src/components/ui/command.tsx` | Fix empty interface |
| `src/components/ui/textarea.tsx` | Fix empty interface |
| `src/hooks/usePlantsQuery.ts` | Remove `as any` |
| `tailwind.config.ts` | Convert require to import |
| `src/App.tsx` | Remove Toaster, configure QueryClient |
| `src/pages/PlantDetail.tsx` | Migrate to Sonner toast |

### Phase 1 Files Deleted
| File | Reason |
|------|--------|
| `src/hooks/use-toast.ts` | Replaced by Sonner |
| `src/components/ui/use-toast.ts` | Replaced by Sonner |
| `src/components/ui/toast.tsx` | Replaced by Sonner |
| `src/components/ui/toaster.tsx` | Replaced by Sonner |

### Phase 2 Files Modified/Created
| File | Change Type |
|------|-------------|
| `src/lib/plant-utils.ts` | New file |
| `src/components/PlantCard.tsx` | Use shared utility |
| `src/components/plant-detail/PlantHeroImage.tsx` | Use shared utility, fix memory leak |
| `package.json` | Remove next-themes |
| `tsconfig.json` | Enable strict mode (optional) |

### Phase 3 Files Created
| File | Change Type |
|------|-------------|
| `src/components/ErrorBoundary.tsx` | New error boundary component |
| `src/contexts/UserContext.tsx` | New user context provider |
| `src/hooks/useWeather.ts` | New weather API hook |

### Phase 3 Files Modified
| File | Change Type |
|------|-------------|
| `src/App.tsx` | Code splitting, ErrorBoundary, UserProvider |
| `src/components/plant-detail/PlantHeroImage.tsx` | Image gallery navigation |
| `src/components/layout/Header.tsx` | Dynamic user data |
| `src/pages/Index.tsx` | Dynamic user greeting |
| `src/components/dashboard/WeatherWidget.tsx` | Real weather API integration |

### Phase 3 Files Deleted (34 unused shadcn/ui components)
| Files |
|-------|
| accordion, alert-dialog, alert, aspect-ratio, badge, breadcrumb, calendar, carousel, chart, checkbox, collapsible, command, context-menu, drawer, hover-card, input-otp, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sidebar, slider, switch, table, tabs, textarea, toggle, toggle-group |

---

## Progress Tracking

| Phase | Task | Status | Completed Date |
|-------|------|--------|----------------|
| 1.1.1 | Fix empty interface (command.tsx) | [x] | 2024-12-21 |
| 1.1.2 | Fix empty interface (textarea.tsx) | [x] | 2024-12-21 |
| 1.1.3 | Fix `as any` (usePlantsQuery.ts) | [x] | 2024-12-21 |
| 1.1.4 | Fix require() (tailwind.config.ts) | [x] | 2024-12-21 |
| 1.2.1 | Remove shadcn/ui Toaster | [x] | 2024-12-21 |
| 1.2.2 | Migrate PlantDetail to Sonner | [x] | 2024-12-21 |
| 1.2.3 | Delete unused toast files | [x] | 2024-12-21 |
| 1.3 | Configure QueryClient | [x] | 2024-12-21 |
| 2.1 | Extract shared utilities | [x] | 2024-12-21 |
| 2.2 | Fix memory leak | [x] | 2024-12-21 |
| 2.3.1 | Remove next-themes | [x] | 2024-12-21 |
| 2.3.2 | Update browserslist | [x] | 2024-12-21 |
| 2.4 | Enable strict TypeScript | [ ] | |
| 3.1 | Image Gallery Navigation | [x] | 2024-12-21 |
| 3.2 | React Error Boundaries | [x] | 2024-12-21 |
| 3.3 | Code Splitting | [x] | 2024-12-21 |
| 3.4 | Remove unused UI components | [x] | 2024-12-21 |
| 3.5 | Dynamic User Data | [x] | 2024-12-21 |
| 3.6 | Weather API Integration | [x] | 2024-12-21 |
