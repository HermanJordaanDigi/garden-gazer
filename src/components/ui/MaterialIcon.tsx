import { cn } from "@/lib/utils";

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

export function MaterialIcon({
  name,
  className,
  filled = false,
  size = "md",
}: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", sizeClasses[size], className)}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      }}
    >
      {name}
    </span>
  );
}
