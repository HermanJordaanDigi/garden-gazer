# Design Overhaul Requirements (Revised)

## Goal
Redesign the Garden Gazer application to match the "Stitch Plant Details" aesthetic provided in design files, creating a cohesive "Muted Woodland" theme across Dashboard, My Plants, and Plant Profile pages.

---

## Design System

### Color Palette
Based on the design files, the actual palette is a **Muted Woodland** theme (not the bright `#13ec13` originally specified):

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `primary` | `#7A9E5C` | `#7A9E5C` | Accent buttons, active nav, highlights |
| `background` | `#E8ECE6` | `#2A332A` | Page background |
| `surface` | `#F2F4F0` | `#3A453A` | Cards, sidebar, inputs |
| `border` | `#DCE0D9` | `#4F5E4F` | Borders, dividers |
| `text-main` | `#3E4A3B` | `#D6DED5` | Primary text |
| `text-muted` | `#7C8C74` | `#A5B59D` | Secondary text, labels |

**Note**: The Plant Profile design file uses a brighter `#13ec13` for accents. Decision required: adopt the **Muted Woodland** palette consistently across all pages, or use the brighter green on Plant Profile only. **Recommendation**: Use Muted Woodland for consistency.

### Typography
- **Font Family**: Inter (weights: 300, 400, 500, 600, 700)
- **Current font (Epilogue)** should be replaced with Inter
- **Headings**: Inter Bold/Black, tight letter-spacing (`tracking-tight`)
- **Body**: Inter Regular/Medium

### Icons
- **Icon Library**: Material Symbols Outlined (variable font)
- **Font Link**: `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap`
- **Usage**: Replace Lucide icons with Material Symbols where specified in designs

### Border Radius
- **Small elements**: `0.25rem` (4px)
- **Medium elements**: `0.5rem` (8px)
- **Large elements (cards)**: `0.75rem` (12px)
- **Extra large (hero cards)**: `1.5rem` (24px)
- **Rounded (buttons, pills)**: `9999px`

### Shadows
- **Cards at rest**: `shadow-sm` (subtle)
- **Cards on hover**: `shadow-xl` with slight translate (`-translate-y-1`)
- **Buttons**: `shadow-lg shadow-primary/20`

---

## Layout Architecture

### Sidebar (Desktop: 288px width)
- Fixed left sidebar, hidden on mobile (`md:flex`)
- Logo/brand area at top with avatar
- Navigation links:
  - **Dashboard** (icon: `dashboard`)
  - **My Plants** (icon: `potted_plant`)
  - **Wishlist** (icon: `favorite`) - *Future feature, can stub*
  - **Settings** (icon: `settings`) - *Future feature, can stub*
- **Active state**: Primary color background at 15% opacity, primary icon color
- **Add Plant** button at bottom (full-width, primary color)

### Header (Top bar)
- Search bar (left side, max-width ~512px)
- Notification button (optional, can stub)
- User avatar with name (right side)
- Mobile: hamburger menu button (toggles sidebar)

### Main Content Area
- Scrollable content area
- Max-width container (`max-w-7xl`)
- Padding: `p-4 md:p-8`

---

## Page Specifications

### Dashboard Page (`/`)

#### Greeting Section
- Large heading: "Good Morning, [User Name]" (hardcode "Sarah" or use generic)
- Subtitle: "Here's what's happening in your jungle today."
- Weather widget (right side): Mock data showing temperature and humidity
  - Format: `24°C • 65% Humidity`
  - Icon: `wb_sunny`

#### My Plants Grid
- Section title: "My Plants"
- Filter pills (horizontal scroll on mobile):
  - "All" (active by default)
  - Type filters based on available data (Perennial, Evergreen, Deciduous, etc.)
  - Sort button
- Grid layout:
  - Desktop: 2 columns (`lg:grid-cols-2`)
  - Mobile: 1 column
  - Gap: `gap-10` (40px)

#### Plant Card (Dashboard version)
- Large rounded cards (`rounded-3xl`)
- Image: `aspect-[4/3]` with hover scale effect
- Content padding: `p-8`
- Common name (large, bold)
- Scientific name (italic, muted)
- "View Details" button (full-width)
- Optional: Status badge (Healthy/Dormant) - *if data supports*
- Optional: Favorite button

#### Add New Plant Card
- Dashed border placeholder card
- Plus icon in circular container
- "Add New Plant" text
- "Grow your jungle" subtitle
- Links to `/add-plant`

### My Plants/Collection Page
This is currently handled via the toggle on Index.tsx. The redesign merges Dashboard and My Plants into one view with the toggle controlling filtered vs. full view.

**Decision Point**: Keep the Searches/Collection toggle, or replace with sidebar navigation?
- **Recommendation**: Replace toggle with sidebar navigation. "Dashboard" shows all plants, "My Plants" shows `bought=true` collection.

### Plant Profile Page (`/plant/:id`)

#### Layout
- Two-column layout on desktop (`lg:grid-cols-12`)
  - Left column (4 cols): Hero image
  - Right column (8 cols): All content

#### Hero Image Section
- White card container with padding (`p-3`)
- Image: `aspect-[4/5]`, `rounded-xl`
- Gallery indicator badge (optional)

#### Header Section
- Badge row (before title):
  - **Type badge**: Primary color background (20% opacity), green text
    - Icon: `public`
    - Text: Plant `type` field
  - **Native Region badge**: Gray background
    - Icon: `location_on`
    - Text: Plant `native_region` field
  - **Growth Habit badge**: Gray background
    - Icon: `category`
    - Text: Plant `growth_habit` field
- **Common Name**: Very large (`text-4xl md:text-5xl`), font-black
- **Scientific Name**: Italic, muted green (`text-[#4c9a4c]`)
- **Description**: Optional text area (not in current DB schema, can omit)

#### Breadcrumb Navigation
- "Library" > [Plant Name]
- Edit button (links to add-plant or future edit page)

#### Characteristics Grid (3x2 on desktop)
**Display only these three** (as per requirements):
1. **Sun Exposure**
   - Icon: `wb_sunny` (orange)
   - Label: "Sun Exposure"
   - Value: `sun_exposure` field
   - Optional progress bar (if data supports rating)

2. **Soil Type**
   - Icon: `grass` (amber)
   - Label: "Soil Type"
   - Value: `soil_type` field

3. **Wind Tolerance**
   - Icon: `air` (gray)
   - Label: "Wind Tolerance"
   - Value: `wind_tolerance` field

**Explicitly EXCLUDED** (per requirements):
- Water Needs
- Temperature
- Growth Rate

#### Mature Dimensions Section
- Card with "Mature Dimensions" title
- Visual representation (plant silhouette vs human reference)
- Height and Width values from `mature_height_width` field
- Parse format: "X-Y cm/m tall, A-B cm/m wide"

#### Biological Traits Section
- Card with "Biological Traits" title
- **Flowering Season**
  - Icon: `local_florist` (purple)
  - Value: `flowering_season` field
- **Flower Colour**
  - Icon: `palette` (pink)
  - Color swatches (use existing `parseFlowerColors` utility)
  - Text description
- **Growth Habit** (if not shown in badges)
  - Icon: `forest` (emerald)
  - Value: `growth_habit` field

#### Retained Features
- Back button (navigate to `/`)
- Edit/Upload image functionality (Dialog)
- Mark as Bought button (if not already bought)

---

## Data Mapping Summary

| Design Element | Database Field | Notes |
|----------------|----------------|-------|
| Plant Name | `common_name` | Fallback to `scientific_name` |
| Scientific Name | `scientific_name` | Italic display |
| Type | `type` | Badge display |
| Native Region | `native_region` | Badge display |
| Growth Habit | `growth_habit` | Badge or traits section |
| Sun Exposure | `sun_exposure` | Characteristic card |
| Soil Type | `soil_type` | Characteristic card |
| Wind Tolerance | `wind_tolerance` | Characteristic card |
| Mature Size | `mature_height_width` | Dimensions section |
| Flowering Season | `flowering_season` | Traits section |
| Flower Color | `flower_colour` | Traits section with swatches |
| Image | `images[0]` | Hero image |
| Price | `price` | Display in appropriate location |
| In Collection | `bought` | Show/hide "Mark as Bought" |

---

## Constraints & Decisions

### Constraints
1. **Excluded Fields**: Water Needs, Temperature, Growth Rate are NOT to be displayed (per original requirements)
2. **No new DB fields**: Work with existing `nurserydb` schema
3. **Keep existing functionality**: Image upload, Mark as Bought, infinite scroll, filtering/sorting
4. **Mobile responsive**: All layouts must work on mobile

### Decisions Needed
1. **Color Palette**: Use Muted Woodland (`#7A9E5C`) consistently, or bright green (`#13ec13`) for Plant Profile?
   - **Recommendation**: Muted Woodland for consistency

2. **Navigation Pattern**: Keep Searches/Collection toggle, or use sidebar navigation?
   - **Recommendation**: Use sidebar navigation for cleaner UX

3. **Weather Widget**: Hardcode mock data, or integrate with weather API?
   - **Recommendation**: Hardcode for MVP, API integration as future enhancement

4. **User Avatar/Name**: Hardcode, or add auth system?
   - **Recommendation**: Hardcode "Sarah" for now; auth is out of scope

5. **Wishlist/Settings**: Stub these nav items, or omit entirely?
   - **Recommendation**: Include as disabled/stub items for visual completeness

---

## Accessibility Considerations
- Ensure color contrast meets WCAG AA standards
- All interactive elements must be keyboard accessible
- Icon buttons need aria-labels
- Maintain focus indicators on all interactive elements
