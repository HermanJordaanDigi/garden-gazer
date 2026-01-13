# Plant Library (AI-Enriched Garden Database)

A personal plant library that turns a simple plant name (as written on a nursery pot sticker) into a complete, enriched plant profile. The app uses an **n8n AI backend** to automatically research the plant species and populate key characteristics, care guidance, and useful metadata—so you don’t have to manually look everything up.

It also includes photo/illustration support and a weather widget tied to your garden’s exact coordinates.

## What the app does

### 1) Fast plant onboarding (name → full profile)
- You enter a plant name (from the pot label)
- The n8n backend orchestrates AI research/enrichment
- The plant profile is automatically populated with relevant plant information

### 2) Searchable plant library
- All plants are viewable in a library/gallery
- Search and filter to quickly find the plant you’re looking for

### 3) Profile images (photo or AI illustration)
Each plant profile can include:
- A real **photo** taken by the user (for accurate identification/records), and/or
- An AI-generated **botanical illustration** (useful as a placeholder until you take a photo later)

### 4) Garden weather widget
- Weather widget is set to the garden’s **exact latitude/longitude**
- Includes a **7-day forecast** to support watering, planting, and maintenance decisions

## Typical plant profile data (examples)
The enrichment pipeline can populate fields like:
- Scientific name / common name
- Sunlight requirements
- Watering needs
- Soil preferences
- Growth habit / size (mature height/spread)
- Hardiness / climate notes
- Toxicity (pets/people), if relevant
- Seasonal interest (flowers, fruit, foliage)
- Notes / tags

_(Exact fields depend on your chosen schema and backend sources.)_

## Who it’s for
- Home gardeners who want a structured, searchable plant database
- People building a garden plan over time and want consistent care info in one place
- Anyone who wants “minimal input, maximum structure” for plant tracking

## Tech stack
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- n8n (AI enrichment + orchestration)

## Getting started (local development)

### Prerequisites
- Node.js + npm (recommended: install via nvm)

### Install & run
```sh
# 1) Clone the repository
git clone <YOUR_GIT_URL>

# 2) Enter the project folder
cd <YOUR_PROJECT_NAME>

# 3) Install dependencies
npm i

# 4) Start the dev server
npm run dev
```
Build
``` sh
npm run build
```
