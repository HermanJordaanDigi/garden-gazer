import { Plant } from "@/types/plant";
import { FeatureCard } from "./FeatureCard";

interface CharacteristicsGridProps {
  plant: Plant;
}

const iconColors = {
  sun: {
    bg: "bg-orange-50",
    text: "text-orange-500",
  },
  soil: {
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  wind: {
    bg: "bg-gray-100",
    text: "text-gray-500",
  },
};

export function CharacteristicsGrid({ plant }: CharacteristicsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FeatureCard
        icon="wb_sunny"
        iconColor={iconColors.sun}
        label="Sun Exposure"
        value={plant.sun_exposure}
      />
      <FeatureCard
        icon="landscape"
        iconColor={iconColors.soil}
        label="Soil Type"
        value={plant.soil_type}
      />
      <FeatureCard
        icon="air"
        iconColor={iconColors.wind}
        label="Wind Tolerance"
        value={plant.wind_tolerance}
      />
    </div>
  );
}
