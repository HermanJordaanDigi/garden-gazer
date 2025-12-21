# design-overhaul Implementation Plan

## Phase 1: Global Setup & Styling
- [ ] Install dependencies: 'Material Symbols Outlined' and 'Inter' font (update index.html)
- [ ] Update `tailwind.config.ts` with new color palette (primary #13ec13, etc.)
- [ ] Refactor `index.css` to enforce new background colors and font settings

## Phase 2: Core Layout Components
- [ ] Create `src/components/layout/Header.tsx` (Search bar, User avatar, Breadcrumbs)
- [ ] Create `src/components/layout/Sidebar.tsx` (Nav links: Dashboard, My Plants, Library)
- [ ] Create `src/components/layout/MainLayout.tsx` (Combines Sidebar, Header, Content)

## Phase 3: Dashboard & My Plants Pages
- [ ] Refactor `src/pages/Index.tsx` to use `MainLayout`
- [ ] Implement "Good Morning" greeting section in Dashboard
- [ ] Implement Weather Widget (mock data for Temp/Humidity)
- [ ] Update `PlantCard` components to match new white-card aesthetic
- [ ] Style Filter/Sort controls to match the theme

## Phase 4: Plant Profile Page Rebuild
- [ ] Refactor `src/pages/PlantDetail.tsx` structure
- [ ] Implement Hero Section (Left: Image, Right: Title/Badges)
- [ ] Map Header Data: `common_name`, `scientific_name`, `type`, `native_region`
- [ ] Create `FeatureCard` component for characteristics
- [ ] Implement Characteristic Grid (Sun, Soil, Wind only) - *Explicitly excluding Water, Temp, Growth*
- [ ] Implement Mature Dimensions section (`mature_height_width`)
- [ ] Implement Biological Traits section (`flowering_season`, `flower_colour`)
