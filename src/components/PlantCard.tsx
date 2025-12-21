import { Plant } from "@/types/plant";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const navigate = useNavigate();

  const getInitials = () => {
    const common = plant.common_name || "";
    const scientific = plant.scientific_name || "";
    const name = common || scientific;
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = () => {
    navigate(`/plant/${plant.id}`);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-woodland-border-light/50 rounded-3xl bg-woodland-surface-light"
      onClick={handleClick}
    >
      {/* Hero Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-woodland-primary/20 to-woodland-background-light overflow-hidden">
        {plant.images?.[0] ? (
          <img
            src={plant.images[0]}
            alt={plant.common_name || "Plant"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-5xl font-bold text-woodland-primary/40">
              {getInitials()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold leading-tight text-woodland-text-main">
            {plant.common_name || "Unknown Plant"}
          </h3>
          <p className="text-base italic text-woodland-text-muted mt-1">
            {plant.scientific_name || "—"}
          </p>
        </div>

        {/* View Details Button */}
        <Button
          variant="outline"
          className="w-full border-woodland-border-light text-woodland-text-main hover:bg-woodland-primary hover:text-white hover:border-woodland-primary transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
