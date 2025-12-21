# Design Overhaul Requirements

## Goal
Redesign the Garden Gazer application to match the "Stitch Plant Details" aesthetic provided in design files.

## Design Requirements
- **Global Theme**:
    - Colors: Primary Green (#13ec13), Background Light (#f6f8f6), Text Dark (#0d1b0d).
    - Typography: Inter font.
    - Icons: Material Symbols Outlined.
- **Layout**:
    - Sidebar navigation.
    - Top header with search and user avatar.
- **Dashboard**:
    - "Good Morning" greeting.
    - Weather widget (mock).
    - Clean white-card styling for plant grid.
- **Plant Profile**:
    - Split layout: Hero image (left) vs Info (right).
    - Specific Data Mapping:
        - Header: Common Name, Scientific Name, Type, Native Region.
        - Info Cards: Sun Exposure, Soil Type, Wind Tolerance.
        - **Excluded**: Water Needs, Temperature, Growth Rate.
        - Dimensions: Mature Height/Width visualization.
        - Traits: Flowering Season, Flower Color.

## Constraints
- Water Needs, Temperature, and Growth Rate data fields are to be omitted.
- Sidebar design to be inferred from Header style (Clean, White/Green).
