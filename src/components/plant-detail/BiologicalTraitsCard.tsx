import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Plant } from "@/types/plant";
import { parseFlowerColors } from "@/lib/color";

interface BiologicalTraitsCardProps {
  plant: Plant;
}

export function BiologicalTraitsCard({ plant }: BiologicalTraitsCardProps) {
  const flowerColors = parseFlowerColors(plant.flower_colour);

  return (
    <div className="bg-white border border-woodland-border-light rounded-xl p-6">
      <h3 className="text-lg font-semibold text-woodland-text-main mb-4">
        Biological Traits
      </h3>

      <div className="space-y-4">
        {/* Flowering Season */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="local_florist" className="text-purple-500" size="md" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-woodland-text-muted font-medium mb-0.5">
              Flowering Season
            </p>
            <p className="text-sm font-semibold text-woodland-text-main">
              {plant.flowering_season || "—"}
            </p>
          </div>
        </div>

        {/* Flower Colour */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="palette" className="text-pink-500" size="md" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-woodland-text-muted font-medium mb-0.5">
              Flower Colour
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {flowerColors.length > 0 ? (
                <>
                  <div className="flex gap-1.5">
                    {flowerColors.map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-woodland-border-light shadow-sm"
                        style={{ backgroundColor: color }}
                        title={plant.flower_colour || ""}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-woodland-text-muted">
                    {plant.flower_colour}
                  </span>
                </>
              ) : (
                <p className="text-sm font-semibold text-woodland-text-main">—</p>
              )}
            </div>
          </div>
        </div>

        {/* Growth Habit */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="forest" className="text-emerald-500" size="md" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-woodland-text-muted font-medium mb-0.5">
              Growth Habit
            </p>
            <p className="text-sm font-semibold text-woodland-text-main">
              {plant.growth_habit || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
