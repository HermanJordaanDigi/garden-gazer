import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function WeatherWidget() {
  return (
    <div className="flex items-center gap-4 bg-woodland-surface-light rounded-xl px-5 py-4 shadow-sm border border-woodland-border-light">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50">
        <MaterialIcon name="wb_sunny" className="text-amber-500" size="xl" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-semibold text-woodland-text-main">24°C</span>
        <span className="text-sm text-woodland-text-muted">Humidity: 65%</span>
      </div>
    </div>
  );
}
