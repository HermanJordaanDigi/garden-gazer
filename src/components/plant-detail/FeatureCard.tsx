import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: string;
  iconColor: {
    bg: string;
    text: string;
  };
  label: string;
  value: string | null;
  rating?: number;
  className?: string;
}

export function FeatureCard({
  icon,
  iconColor,
  label,
  value,
  rating,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-woodland-border-light rounded-xl p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            iconColor.bg
          )}
        >
          <MaterialIcon name={icon} className={iconColor.text} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-woodland-text-muted font-medium mb-1">
            {label}
          </p>
          <p className="text-sm font-semibold text-woodland-text-main truncate">
            {value || "—"}
          </p>
          {rating !== undefined && (
            <div className="mt-2 h-1.5 bg-woodland-border-light rounded-full overflow-hidden">
              <div
                className="h-full bg-woodland-primary rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, rating))}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
