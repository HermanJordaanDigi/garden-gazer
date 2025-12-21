import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Plant } from "@/types/plant";

interface DimensionsCardProps {
  plant: Plant;
}

interface ParsedDimensions {
  height: string | null;
  width: string | null;
  heightCm: number | null;
}

function parseMatureSize(sizeString: string | null): ParsedDimensions {
  if (!sizeString) {
    return { height: null, width: null, heightCm: null };
  }

  // Patterns to match various formats:
  // "30-60 cm tall, 60 cm wide"
  // "Up to 90 cm tall, 180 cm wide"
  // "2 - 3m tall, 1 - 1.5m wide"
  // "3–7 m tall, 3–6 m wide"

  const heightMatch = sizeString.match(
    /(?:up\s*to\s*)?(\d+(?:\.\d+)?)\s*(?:[-–]\s*(\d+(?:\.\d+)?))?\s*(cm|m)\s*tall/i
  );
  const widthMatch = sizeString.match(
    /(?:up\s*to\s*)?(\d+(?:\.\d+)?)\s*(?:[-–]\s*(\d+(?:\.\d+)?))?\s*(cm|m)\s*wide/i
  );

  let height: string | null = null;
  let width: string | null = null;
  let heightCm: number | null = null;

  if (heightMatch) {
    const min = parseFloat(heightMatch[1]);
    const max = heightMatch[2] ? parseFloat(heightMatch[2]) : null;
    const unit = heightMatch[3].toLowerCase();

    // Convert to cm for visualization
    const multiplier = unit === "m" ? 100 : 1;
    heightCm = max ? (max * multiplier) : (min * multiplier);

    if (max) {
      height = `${min}–${max} ${unit}`;
    } else {
      height = `${min} ${unit}`;
    }
  }

  if (widthMatch) {
    const min = parseFloat(widthMatch[1]);
    const max = widthMatch[2] ? parseFloat(widthMatch[2]) : null;
    const unit = widthMatch[3].toLowerCase();

    if (max) {
      width = `${min}–${max} ${unit}`;
    } else {
      width = `${min} ${unit}`;
    }
  }

  return { height, width, heightCm };
}

export function DimensionsCard({ plant }: DimensionsCardProps) {
  const { height, width, heightCm } = parseMatureSize(plant.mature_height_width);

  // Human reference height in cm (average person ~170cm)
  const humanHeightCm = 170;

  // Calculate relative sizes for visualization
  // Scale everything relative to human height (human = 100% of a fixed height)
  const visualizationMaxHeight = 120; // pixels
  const humanVisualHeight = visualizationMaxHeight;

  // Calculate plant visual height relative to human
  let plantVisualHeight = 0;
  if (heightCm) {
    plantVisualHeight = Math.min(
      (heightCm / humanHeightCm) * humanVisualHeight,
      visualizationMaxHeight * 1.5 // Cap at 150% of human height visually
    );
    // Minimum visible height
    plantVisualHeight = Math.max(plantVisualHeight, 20);
  }

  return (
    <div className="bg-white border border-woodland-border-light rounded-xl p-6">
      <h3 className="text-lg font-semibold text-woodland-text-main mb-4">
        Mature Size
      </h3>

      {/* Visual Representation */}
      <div className="flex items-end justify-center gap-8 mb-6 h-32">
        {/* Human Silhouette */}
        <div className="flex flex-col items-center">
          <div
            className="flex flex-col items-center justify-end"
            style={{ height: `${humanVisualHeight}px` }}
          >
            <MaterialIcon
              name="accessibility_new"
              className="text-gray-300"
              size="xl"
            />
          </div>
          <span className="text-xs text-woodland-text-muted mt-1">1.7m</span>
        </div>

        {/* Plant Height Indicator */}
        {heightCm && (
          <div className="flex flex-col items-center">
            <div
              className="flex flex-col items-center justify-end"
              style={{ height: `${plantVisualHeight}px` }}
            >
              <div className="w-1 bg-woodland-primary rounded-full flex-1 min-h-[8px]" />
              <MaterialIcon
                name="park"
                className="text-woodland-primary"
                size="lg"
              />
            </div>
            <span className="text-xs text-woodland-text-muted mt-1">
              {height}
            </span>
          </div>
        )}
      </div>

      {/* Text Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-woodland-surface-light rounded-lg">
          <MaterialIcon
            name="height"
            className="text-woodland-text-muted mb-1"
            size="md"
          />
          <p className="text-xs uppercase tracking-wider text-woodland-text-muted font-medium">
            Height
          </p>
          <p className="text-sm font-semibold text-woodland-text-main">
            {height || "—"}
          </p>
        </div>
        <div className="text-center p-3 bg-woodland-surface-light rounded-lg">
          <MaterialIcon
            name="swap_horiz"
            className="text-woodland-text-muted mb-1"
            size="md"
          />
          <p className="text-xs uppercase tracking-wider text-woodland-text-muted font-medium">
            Width
          </p>
          <p className="text-sm font-semibold text-woodland-text-main">
            {width || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
