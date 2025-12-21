import { Plant } from "@/types/plant";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlantHeaderProps {
  plant: Plant;
  onMarkAsBought?: () => void;
  isMarkingAsBought?: boolean;
}

interface BadgeProps {
  icon: string;
  label: string;
  variant?: "primary" | "secondary";
}

function Badge({ icon, label, variant = "secondary" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
        variant === "primary"
          ? "bg-woodland-primary text-white"
          : "bg-woodland-surface-light text-woodland-text-muted"
      )}
    >
      <MaterialIcon name={icon} size="sm" />
      {label}
    </span>
  );
}

export function PlantHeader({
  plant,
  onMarkAsBought,
  isMarkingAsBought = false,
}: PlantHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Badge Row */}
      <div className="flex flex-wrap items-center gap-2">
        {plant.type && (
          <Badge icon="public" label={plant.type} variant="primary" />
        )}
        {plant.native_region && (
          <Badge icon="location_on" label={plant.native_region} />
        )}
        {plant.growth_habit && (
          <Badge icon="category" label={plant.growth_habit} />
        )}
      </div>

      {/* Name Section */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-woodland-text-main tracking-tight">
          {plant.common_name || "Unknown Plant"}
        </h1>
        <p className="text-xl italic text-woodland-primary mt-1">
          {plant.scientific_name || "—"}
        </p>
      </div>

      {/* Actions */}
      {!plant.bought && onMarkAsBought && (
        <div className="pt-2">
          <Button
            onClick={onMarkAsBought}
            disabled={isMarkingAsBought}
            className="gap-2"
            size="lg"
          >
            <MaterialIcon name="shopping_bag" size="md" />
            {isMarkingAsBought ? "Adding to Collection..." : "Add to Collection"}
          </Button>
        </div>
      )}

      {plant.bought && (
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <MaterialIcon name="check_circle" size="sm" filled />
            In Your Collection
          </span>
        </div>
      )}
    </div>
  );
}
