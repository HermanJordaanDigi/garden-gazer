import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useWeather, getWeatherIcon } from "@/hooks/useWeather";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

export function WeatherWidget() {
  const { profile } = useUser();
  const navigate = useNavigate();
  
  // Cast to access new columns (types may not be updated yet)
  const p = profile as typeof profile & { garden_latitude?: number; garden_longitude?: number };
  const latitude = p?.garden_latitude ?? -33.9249;
  const longitude = p?.garden_longitude ?? 18.4241;
  
  const { data: weather, isLoading, isError } = useWeather(latitude, longitude);

  const handleClick = () => {
    navigate("/weather");
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 bg-woodland-surface-light rounded-xl px-5 py-4 shadow-sm border border-woodland-border-light animate-pulse">
        <div className="w-12 h-12 rounded-full bg-woodland-background-light" />
        <div className="flex flex-col gap-2">
          <div className="w-16 h-6 bg-woodland-background-light rounded" />
          <div className="w-24 h-4 bg-woodland-background-light rounded" />
        </div>
      </div>
    );
  }

  if (isError || !weather) {
    return (
      <div className="flex items-center gap-4 bg-woodland-surface-light rounded-xl px-5 py-4 shadow-sm border border-woodland-border-light">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50">
          <MaterialIcon name="cloud_off" className="text-gray-400" size="xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium text-woodland-text-muted">Weather unavailable</span>
        </div>
      </div>
    );
  }

  const iconName = getWeatherIcon(weather.weatherCode, weather.isDay);
  const iconBgClass = weather.isDay ? "bg-amber-50" : "bg-indigo-50";
  const iconColorClass = weather.isDay ? "text-amber-500" : "text-indigo-400";

  return (
    <div 
      onClick={handleClick}
      className="flex items-center gap-6 bg-woodland-surface-light rounded-xl px-5 py-4 shadow-sm border border-woodland-border-light cursor-pointer hover:border-woodland-primary hover:shadow-md transition-all"
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBgClass}`}>
        <MaterialIcon name={iconName} className={iconColorClass} size="xl" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-semibold text-woodland-text-main">{weather.temperature}°C</span>
        <span className="text-sm text-woodland-text-muted">Humidity: {weather.humidity}%</span>
      </div>
      <div className="flex gap-4 text-sm text-woodland-text-muted">
        <div className="flex items-center gap-1">
          <MaterialIcon name="wb_sunny" size="sm" className="text-amber-500" />
          <span>{weather.sunrise}</span>
        </div>
        <div className="flex items-center gap-1">
          <MaterialIcon name="nights_stay" size="sm" className="text-indigo-400" />
          <span>{weather.sunset}</span>
        </div>
      </div>
      <MaterialIcon name="chevron_right" size="md" className="text-woodland-text-muted ml-auto" />
    </div>
  );
}
