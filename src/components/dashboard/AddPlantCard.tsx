import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function AddPlantCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/add-plant")}
      className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-woodland-border-light bg-woodland-surface-light/50 cursor-pointer transition-all duration-300 hover:border-woodland-primary hover:bg-woodland-surface-light aspect-[4/3] min-h-[300px]"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-woodland-primary/10 mb-4">
        <MaterialIcon
          name="add"
          className="text-woodland-primary"
          size="xl"
        />
      </div>
      <span className="text-lg font-semibold text-woodland-text-main">
        Add New Plant
      </span>
      <span className="text-sm text-woodland-text-muted mt-1">
        Grow your jungle
      </span>
    </div>
  );
}
