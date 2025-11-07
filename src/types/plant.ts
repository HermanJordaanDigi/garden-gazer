export interface Plant {
  id: number;
  scientific_name: string | null;
  common_name: string | null;
  native_region: string | null;
  type: string | null;
  soil_type: string | null;
  sun_exposure: string | null;
  wind_tolerance: string | null;
  growth_habit: string | null;
  mature_height_width: string | null;
  flowering_season: string | null;
  flower_colour: string | null;
  images: string[] | null;
  price: number | null;
  bought?: boolean | null;
}

export const SAMPLE_PLANTS: Plant[] = [
  {
    id: 1,
    scientific_name: "Cuphea Hyssopifolia",
    common_name: "False Heather",
    native_region: "Mexico, Guatemala, and Honduras",
    type: "Evergreen Perennial",
    soil_type: "Well-drained soil",
    sun_exposure: "Full Sun to Partial Shade",
    wind_tolerance: "Moderate",
    growth_habit: "Compact Shrub",
    mature_height_width: "30–60 cm tall, 60 cm wide",
    flowering_season: "Spring to Autumn",
    flower_colour: "Purple, Pink, or White",
    images: null,
    price: null
  },
  {
    id: 2,
    scientific_name: "Gaura Lindheimerii",
    common_name: "Lindheimer's Beeblossom",
    native_region: "Texas and Louisiana, USA",
    type: "Perennial",
    soil_type: "Well-drained sandy or loamy soil",
    sun_exposure: "Full Sun",
    wind_tolerance: "High",
    growth_habit: "Airy Perennial",
    mature_height_width: "90–120 cm tall, 30–60 cm wide",
    flowering_season: "Late Spring to Autumn",
    flower_colour: "White or Pink",
    images: null,
    price: null
  },
  {
    id: 3,
    scientific_name: "Festuca Glauca",
    common_name: "Blue Fescue",
    native_region: "Europe",
    type: "Semi-Evergreen Perennial",
    soil_type: "Well-drained, moderately fertile soil",
    sun_exposure: "Full Sun",
    wind_tolerance: "Tolerant",
    growth_habit: "Clump-forming Ornamental Grass",
    mature_height_width: "25–30 cm tall, 25–30 cm wide",
    flowering_season: "Early Summer",
    flower_colour: "Light Green with Purple Tinge",
    images: null,
    price: null
  },
  {
    id: 4,
    scientific_name: "Juniperus Virginiana Grey Owl",
    common_name: "Grey Owl Juniper",
    native_region: "North America",
    type: "Evergreen",
    soil_type: "Dry to moist, well-drained soil",
    sun_exposure: "Full Sun",
    wind_tolerance: "High",
    growth_habit: "Shrub",
    mature_height_width: "Up to 90 cm tall, 180 cm wide",
    flowering_season: "Spring to early Summer",
    flower_colour: "Inconspicuous; produces blue-grey berry-like cones",
    images: null,
    price: null
  },
  {
    id: 5,
    scientific_name: "Cymbopogon Citratus",
    common_name: "Lemongrass",
    native_region: "South Asia and Maritime Southeast Asia",
    type: "Perennial",
    soil_type: "Well-drained, slightly acidic to neutral soil",
    sun_exposure: "Full Sun",
    wind_tolerance: "Moderate; benefits from some wind protection",
    growth_habit: "Clump-forming Grass",
    mature_height_width: "60–120 cm tall, 60–90 cm wide",
    flowering_season: "Rarely flowers",
    flower_colour: "Brown",
    images: null,
    price: null
  },
  {
    id: 6,
    scientific_name: "Tulbaghia Violacea Variegata",
    common_name: "Variegated Society Garlic",
    native_region: "Eastern South Africa",
    type: "Evergreen Perennial",
    soil_type: "Well-drained loam or sandy soil",
    sun_exposure: "Full Sun",
    wind_tolerance: "Moderate to High",
    growth_habit: "Clump-forming Groundcover",
    mature_height_width: "30–60 cm tall, 30–60 cm wide",
    flowering_season: "Early Summer to Autumn",
    flower_colour: "Lilac or Lavender",
    images: null,
    price: null
  },
  {
    id: 7,
    scientific_name: "Soleirolia Soleirolii",
    common_name: "Baby's Tears",
    native_region: "Mediterranean",
    type: "Herbaceous Perennial",
    soil_type: "Rich, moist loam; slightly acidic",
    sun_exposure: "Partial Sun to Shade",
    wind_tolerance: "Low; sensitive to strong winds",
    growth_habit: "Groundcover",
    mature_height_width: "10 cm tall, up to 90 cm wide",
    flowering_season: "Spring and Summer",
    flower_colour: "Creamy Ivory",
    images: null,
    price: null
  },
  {
    id: 8,
    scientific_name: "Sambucus Nigra",
    common_name: "Black Elder, Elderberry",
    native_region: "Europe, Western Asia, North Africa",
    type: "Deciduous Perennial",
    soil_type: "Rich, moist, well-drained, slightly acidic to neutral soil",
    sun_exposure: "Full Sun to Partial Shade",
    wind_tolerance: "Moderate; branches susceptible to wind damage",
    growth_habit: "Multi-stemmed Shrub or Small Tree",
    mature_height_width: "3–7 m tall, 3–6 m wide",
    flowering_season: "Late Spring to Mid-Summer",
    flower_colour: "Ivory White",
    images: null,
    price: 4.00
  }
];
