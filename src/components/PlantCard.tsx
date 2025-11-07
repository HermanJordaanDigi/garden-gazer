import { Plant } from "@/types/plant";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Wind, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
interface PlantCardProps {
  plant: Plant;
}
export function PlantCard({
  plant
}: PlantCardProps) {
  const navigate = useNavigate();
  const getInitials = () => {
    const common = plant.common_name || "";
    const scientific = plant.scientific_name || "";
    const name = common || scientific;
    return name.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2);
  };
  const handleClick = () => {
    navigate(`/plant/${plant.id}`);
  };
  return <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border-border/50 active:scale-[0.98]" onClick={handleClick}>
      {/* Hero Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        {plant.images ? <img src={plant.images} alt={plant.common_name || "Plant"} className="w-full h-full object-cover" /> : <div className="text-4xl font-bold text-primary/40">
            {getInitials()}
          </div>}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-lg leading-tight text-foreground">
            {plant.common_name || "Unknown Plant"}
          </h3>
          <p className="text-sm italic text-muted-foreground mt-0.5">
            {plant.scientific_name || "—"}
          </p>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          {plant.native_region && <Badge variant="secondary" className="text-xs text-white bg-[#386641]">
              {plant.native_region}
            </Badge>}
          {plant.type && <Badge variant="outline" className="text-xs">
              {plant.type}
            </Badge>}
        </div>

        {/* Key Attributes */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
          {plant.sun_exposure && <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4" />
              <span className="line-clamp-1">{plant.sun_exposure}</span>
            </div>}
          {plant.wind_tolerance && <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4" />
              <span className="line-clamp-1">{plant.wind_tolerance}</span>
            </div>}
          {plant.growth_habit && <div className="flex items-center gap-1.5">
              <Sprout className="w-4 h-4" />
              <span className="line-clamp-1">{plant.growth_habit}</span>
            </div>}
        </div>
      </div>
    </Card>;
}