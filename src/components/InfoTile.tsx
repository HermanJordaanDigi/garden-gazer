import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InfoTileProps {
  icon: LucideIcon;
  label: string;
  value: string | null;
}

export function InfoTile({ icon: Icon, label, value }: InfoTileProps) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground">
        {value || "—"}
      </p>
    </Card>
  );
}
