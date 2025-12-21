# Design Overhaul Implementation Plan (Revised)

This plan provides detailed, actionable steps for implementing the Garden Gazer redesign. Each phase builds on the previous, with clear file paths, component specifications, and data connections.

---

## Phase 1: Global Setup & Styling Foundation

### 1.1 Install Fonts & Icons
**File**: `index.html`

- [x] Add Inter font (replace Epilogue):
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ```
- [x] Add Material Symbols Outlined:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  ```
- [x] Remove existing Epilogue font link

### 1.2 Update Tailwind Configuration
**File**: `tailwind.config.ts`

- [x] Update `fontFamily`:
  ```ts
  fontFamily: {
    display: ['Inter', 'sans-serif'],
    sans: ['Inter', 'sans-serif'],
  }
  ```
- [x] Add custom colors for the Muted Woodland palette:
  ```ts
  colors: {
    // ... existing shadcn colors ...
    'woodland': {
      'primary': '#7A9E5C',
      'background-light': '#E8ECE6',
      'background-dark': '#2A332A',
      'surface-light': '#F2F4F0',
      'surface-dark': '#3A453A',
      'border-light': '#DCE0D9',
      'border-dark': '#4F5E4F',
      'text-main': '#3E4A3B',
      'text-muted': '#7C8C74',
    }
  }
  ```

### 1.3 Update CSS Variables
**File**: `src/index.css`

- [x] Update `:root` CSS variables to match Muted Woodland palette:
  - `--background`: Convert `#E8ECE6` to HSL
  - `--foreground`: Convert `#3E4A3B` to HSL
  - `--primary`: Convert `#7A9E5C` to HSL
  - `--card`: Convert `#F2F4F0` to HSL
  - `--muted`: Adjust for text-muted color
  - `--border`: Convert `#DCE0D9` to HSL
- [x] Update `.dark` variables for dark mode support
- [x] Change body font from Epilogue to Inter:
  ```css
  body {
    @apply bg-background text-foreground font-sans;
  }
  ```
- [x] Add Material Symbols styling:
  ```css
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  ```

### 1.4 Create Icon Component
**File**: `src/components/ui/MaterialIcon.tsx` (new)

- [x] Create a wrapper component for Material Symbols:
  ```tsx
  interface MaterialIconProps {
    name: string;
    className?: string;
    filled?: boolean;
  }
  export function MaterialIcon({ name, className, filled }: MaterialIconProps) {
    return (
      <span
        className={cn("material-symbols-outlined", className)}
        style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
      >
        {name}
      </span>
    );
  }
  ```

---

## Phase 2: Layout Components

### 2.1 Create Sidebar Component
**File**: `src/components/layout/Sidebar.tsx` (new)

- [x] Create sidebar container (w-72, hidden md:flex)
- [x] Add logo/brand section with plant avatar
- [x] Implement navigation links:
  | Label | Icon | Route | Active Condition |
  |-------|------|-------|------------------|
  | Dashboard | `dashboard` | `/` | `pathname === '/'` |
  | My Plants | `potted_plant` | `/?view=collection` | `searchParams.get('view') === 'collection'` |
  | Wishlist | `favorite` | `#` | Disabled/stub |
  | Settings | `settings` | `#` | Disabled/stub |
- [x] Style active state: `bg-primary/15 text-text-main`
- [x] Style hover state: `hover:bg-background-light`
- [x] Add "Add Plant" button at bottom (links to `/add-plant`)

### 2.2 Create Header Component
**File**: `src/components/layout/Header.tsx` (new)

- [x] Create header bar (sticky, border-bottom)
- [x] Add mobile hamburger button (md:hidden)
- [x] Add search input with icon:
  - Icon: `search`
  - Placeholder: "Search your plants..."
  - Connect to existing `usePlantsQuery` search filter
- [x] Add user avatar section (right side):
  - Notification button (stub): icon `notifications`
  - Avatar image with name "Sarah"

### 2.3 Create MainLayout Component
**File**: `src/components/layout/MainLayout.tsx` (new)

- [x] Compose Sidebar + Header + children:
  ```tsx
  export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex bg-background-light">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }
  ```
- [x] Add mobile sidebar state management (useState for open/close)
- [x] Implement responsive behavior:
  - Desktop: Fixed sidebar visible
  - Mobile: Sidebar as slide-out drawer (use Sheet component)

### 2.4 Create Breadcrumb Component
**File**: `src/components/layout/Breadcrumb.tsx` (new)

- [x] Accept `items` prop: `{ label: string; href?: string }[]`
- [x] Use Material icon `chevron_right` as separator
- [x] Style: muted links, current item in main text color

---

## Phase 3: Dashboard & Plant Grid

### 3.1 Refactor Index Page
**File**: `src/pages/Index.tsx`

- [ ] Wrap content in `<MainLayout>`
- [ ] Remove existing header (moved to MainLayout)
- [ ] Update URL handling:
  - Use `?view=collection` query param instead of local state
  - Read view mode from URL: `const view = searchParams.get('view')`
  - Update `usePlantsQuery` filter: `bought: view === 'collection'`

### 3.2 Add Greeting Section
**File**: `src/pages/Index.tsx` (continued)

- [ ] Add greeting section at top of content:
  ```tsx
  <section className="max-w-7xl mx-auto w-full pt-2">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Good Morning, Sarah</h1>
        <p className="text-text-muted mt-2 text-lg font-light">
          Here's what's happening in your jungle today.
        </p>
      </div>
      <WeatherWidget />
    </div>
  </section>
  ```

### 3.3 Create Weather Widget Component
**File**: `src/components/dashboard/WeatherWidget.tsx` (new)

- [ ] Display mock weather data:
  - Temperature: 24°C
  - Humidity: 65%
- [ ] Icon: `wb_sunny`
- [ ] Styling: Surface background, rounded-xl, shadow-sm

### 3.4 Update Filter Section
**File**: `src/pages/Index.tsx` (continued)

- [ ] Replace dropdown filters with pill buttons:
  - "All" (active: primary bg, white text)
  - Type-based filters from existing typeOptions
- [ ] Style as horizontal scroll on mobile
- [ ] Add Sort button with icon `sort`
- [ ] Keep existing filter logic, just update UI

### 3.5 Create New PlantCard (Dashboard Version)
**File**: `src/components/PlantCard.tsx`

- [ ] Update card styling:
  - `rounded-3xl` border radius
  - `overflow-hidden`
  - Hover: `shadow-xl`, `-translate-y-1`
  - `border border-border-light/50`
- [ ] Image section:
  - `aspect-[4/3]`
  - Hover: `scale-105` with transition
- [ ] Content section (`p-8`):
  - Common name: `text-2xl font-bold`
  - Scientific name: `text-base italic text-muted`
  - Remove badges and attributes (simpler card)
  - Add "View Details" button (full-width)
- [ ] Optional: Add favorite button (heart icon)

### 3.6 Create AddPlantCard Component
**File**: `src/components/dashboard/AddPlantCard.tsx` (new)

- [ ] Dashed border card matching grid item size
- [ ] Plus icon in circular container
- [ ] "Add New Plant" text
- [ ] "Grow your jungle" subtitle
- [ ] onClick navigates to `/add-plant`

### 3.7 Update Grid Layout
**File**: `src/pages/Index.tsx`

- [ ] Change grid to 2 columns on desktop: `lg:grid-cols-2`
- [ ] Increase gap: `gap-10`
- [ ] Add `<AddPlantCard />` as last grid item

---

## Phase 4: Plant Profile Page Rebuild

### 4.1 Update PlantDetail Layout
**File**: `src/pages/PlantDetail.tsx`

- [ ] Wrap in MainLayout or keep full-width (design shows no sidebar)
  - **Decision**: PlantDetail uses full-width layout with just Header breadcrumb
- [ ] Implement two-column grid:
  ```tsx
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-4">{/* Hero Image */}</div>
    <div className="lg:col-span-8">{/* Content */}</div>
  </div>
  ```

### 4.2 Create PlantHeroImage Component
**File**: `src/components/plant-detail/PlantHeroImage.tsx` (new)

- [ ] White card container with padding (`p-3`)
- [ ] Image with `aspect-[4/5]`, `rounded-xl`
- [ ] Gallery badge overlay (top-right)
- [ ] Image upload button integration (existing Dialog)

### 4.3 Create PlantHeader Component
**File**: `src/components/plant-detail/PlantHeader.tsx` (new)

- [ ] Badge row (flex, gap-2):
  - Type badge: primary color, icon `public`
  - Native region badge: gray, icon `location_on`
  - Growth habit badge: gray, icon `category`
- [ ] Common name: `text-4xl md:text-5xl font-black`
- [ ] Scientific name: `text-xl italic text-[#4c9a4c]`
- [ ] Connect to plant data via props

### 4.4 Create FeatureCard Component
**File**: `src/components/plant-detail/FeatureCard.tsx` (new)

- [ ] Props: `icon`, `iconColor`, `label`, `value`, `rating?`
- [ ] White card with border
- [ ] Icon in colored circular background
- [ ] Label (uppercase, small, muted)
- [ ] Value (bold)
- [ ] Optional: Progress bar for ratings

### 4.5 Create CharacteristicsGrid Component
**File**: `src/components/plant-detail/CharacteristicsGrid.tsx` (new)

- [ ] Grid: `grid-cols-2 md:grid-cols-3 gap-4`
- [ ] Render only 3 FeatureCards:
  1. Sun Exposure (`sun_exposure`)
  2. Soil Type (`soil_type`)
  3. Wind Tolerance (`wind_tolerance`)
- [ ] Map icon colors:
  - Sun: orange (`bg-orange-50`, `text-orange-500`)
  - Soil: amber (`bg-amber-50`, `text-amber-700`)
  - Wind: gray (`bg-gray-50`, `text-gray-500`)

### 4.6 Create DimensionsCard Component
**File**: `src/components/plant-detail/DimensionsCard.tsx` (new)

- [ ] Parse `mature_height_width` field
- [ ] Create regex parser for formats like:
  - "30-60 cm tall, 60 cm wide"
  - "Up to 90 cm tall, 180 cm wide"
  - "2 - 3m tall, 1 - 1.5m wide"
- [ ] Visual representation:
  - Human silhouette reference (icon `accessibility_new` at ~1.7m)
  - Plant height indicator
- [ ] Display height and width in grid below visual

### 4.7 Create BiologicalTraitsCard Component
**File**: `src/components/plant-detail/BiologicalTraitsCard.tsx` (new)

- [ ] Card with "Biological Traits" title
- [ ] List of traits:
  1. Flowering Season:
     - Icon: `local_florist` (purple)
     - Value: `flowering_season`
  2. Flower Colour:
     - Icon: `palette` (pink)
     - Color swatches using existing `parseFlowerColors`
     - Text description from `flower_colour`
  3. Growth Habit (optional, if not in header):
     - Icon: `forest` (emerald)
     - Value: `growth_habit`

### 4.8 Assemble PlantDetail Page
**File**: `src/pages/PlantDetail.tsx`

- [ ] Add Breadcrumb: "Library" > [plant.common_name]
- [ ] Add Edit button (top-right of header area)
- [ ] Replace existing layout with:
  ```tsx
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-4">
      <PlantHeroImage plant={plant} onUpload={handleUpdateImage} />
    </div>
    <div className="lg:col-span-8 space-y-6">
      <PlantHeader plant={plant} />
      <CharacteristicsGrid plant={plant} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DimensionsCard plant={plant} />
        <BiologicalTraitsCard plant={plant} />
      </div>
    </div>
  </div>
  ```
- [ ] Keep "Mark as Bought" functionality
- [ ] Remove accordions (data now displayed in cards)

---

## Phase 5: Navigation & State Updates

### 5.1 Update Routing Logic
**File**: `src/App.tsx`

- [ ] No changes needed to routes
- [ ] Routes remain:
  - `/` - Index (Dashboard/My Plants)
  - `/plant/:id` - PlantDetail
  - `/add-plant` - AddPlant

### 5.2 Connect Search to Header
**File**: `src/components/layout/Header.tsx`

- [ ] Add search state management
- [ ] Options:
  1. Lift state to MainLayout and pass down
  2. Use URL query params (`?search=...`)
  3. Use React context
- [ ] **Recommendation**: Use URL query params for shareable/bookmarkable state
- [ ] Update `usePlantsQuery` to read search from URL

### 5.3 Connect Sidebar Navigation
**File**: `src/components/layout/Sidebar.tsx`

- [ ] Use `react-router-dom` `Link` and `useLocation`
- [ ] Dashboard link: `to="/"`
- [ ] My Plants link: `to="/?view=collection"`
- [ ] Highlight active link based on current path/params

---

## Phase 6: Polish & Testing

### 6.1 Responsive Testing
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1280px+)
- [ ] Ensure sidebar drawer works on mobile
- [ ] Verify grid layouts collapse correctly

### 6.2 Dark Mode Support
- [ ] Verify all new colors work in dark mode
- [ ] Test toggle between light/dark (if implemented)
- [ ] Ensure sufficient contrast in both modes

### 6.3 Accessibility Audit
- [ ] Add aria-labels to icon-only buttons
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader (basic check)
- [ ] Verify focus states are visible

### 6.4 Performance Check
- [ ] Verify infinite scroll still works
- [ ] Check image loading performance
- [ ] Test data fetching on slow network

### 6.5 Clean Up
- [ ] Remove unused Lucide icon imports (replace with MaterialIcon)
- [ ] Remove old InfoTile component (if replaced)
- [ ] Remove old FilterChips component (if replaced)
- [ ] Update any remaining Epilogue font references

---

## File Creation Summary

### New Files to Create
| File Path | Purpose |
|-----------|---------|
| `src/components/ui/MaterialIcon.tsx` | Material Symbols wrapper |
| `src/components/layout/Sidebar.tsx` | Left navigation sidebar |
| `src/components/layout/Header.tsx` | Top header with search |
| `src/components/layout/MainLayout.tsx` | Main layout wrapper |
| `src/components/layout/Breadcrumb.tsx` | Breadcrumb navigation |
| `src/components/dashboard/WeatherWidget.tsx` | Mock weather display |
| `src/components/dashboard/AddPlantCard.tsx` | Add plant CTA card |
| `src/components/plant-detail/PlantHeroImage.tsx` | Hero image section |
| `src/components/plant-detail/PlantHeader.tsx` | Plant name & badges |
| `src/components/plant-detail/FeatureCard.tsx` | Reusable feature card |
| `src/components/plant-detail/CharacteristicsGrid.tsx` | Grid of characteristics |
| `src/components/plant-detail/DimensionsCard.tsx` | Mature size visualization |
| `src/components/plant-detail/BiologicalTraitsCard.tsx` | Flowering & traits |

### Files to Modify
| File Path | Changes |
|-----------|---------|
| `index.html` | Add Inter font, Material Symbols |
| `tailwind.config.ts` | Update font, add woodland colors |
| `src/index.css` | Update CSS variables, font |
| `src/pages/Index.tsx` | Refactor to use MainLayout, new grid |
| `src/pages/PlantDetail.tsx` | Complete redesign |
| `src/components/PlantCard.tsx` | Update styling |

### Files to Potentially Remove/Deprecate
| File Path | Reason |
|-----------|--------|
| `src/components/InfoTile.tsx` | Replaced by FeatureCard |
| `src/components/FilterChips.tsx` | Replaced by pill buttons |

---

## Dependencies

### Required (existing)
- `@tanstack/react-query` - Data fetching
- `react-router-dom` - Routing
- `react-intersection-observer` - Infinite scroll
- `tailwindcss` - Styling
- `@radix-ui/*` - UI primitives (via shadcn)

### No New Dependencies Required
- Material Symbols loaded via Google Fonts CDN
- Inter font loaded via Google Fonts CDN

---

## Risk Mitigation

1. **Breaking existing functionality**:
   - Keep usePlantsQuery unchanged
   - Maintain existing mutation hooks
   - Test infinite scroll after grid changes

2. **Dark mode inconsistency**:
   - Define all dark mode variables upfront
   - Test both modes during development

3. **Mobile UX regression**:
   - Test sidebar drawer early
   - Ensure touch targets meet 44px minimum

4. **Performance impact**:
   - New fonts are cached by browser
   - Material Symbols variable font is efficient
   - No new JS dependencies
