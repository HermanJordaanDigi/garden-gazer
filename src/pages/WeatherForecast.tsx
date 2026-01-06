import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useWeatherForecast, DayForecast } from "@/hooks/useWeatherForecast";
import { getWeatherIcon, getWeatherDescription } from "@/hooks/useWeather";
import { useUser } from "@/contexts/UserContext";
import { format } from "date-fns";

function ForecastCard({ day, isToday }: { day: DayForecast; isToday: boolean }) {
  const iconName = getWeatherIcon(day.weatherCode, true);
  const description = getWeatherDescription(day.weatherCode);

  return (
    <div
      className={`rounded-xl p-5 border ${
        isToday
          ? "bg-woodland-primary/10 border-woodland-primary"
          : "bg-woodland-surface-light border-woodland-border-light"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-lg font-semibold ${isToday ? "text-woodland-primary" : "text-woodland-text-main"}`}>
            {isToday ? "Today" : format(day.date, "EEEE")}
          </p>
          <p className="text-sm text-woodland-text-muted">
            {format(day.date, "MMM d")}
          </p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50">
          <MaterialIcon name={iconName} className="text-amber-500" size="xl" />
        </div>
      </div>

      <p className="text-sm text-woodland-text-muted mb-4">{description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MaterialIcon name="thermostat" size="sm" className="text-red-400" />
          <span className="text-xl font-bold text-woodland-text-main">{day.tempMax}°</span>
        </div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="ac_unit" size="sm" className="text-blue-400" />
          <span className="text-lg text-woodland-text-muted">{day.tempMin}°</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-woodland-text-muted">
          <MaterialIcon name="water_drop" size="sm" className="text-blue-400" />
          <span>{day.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-woodland-text-muted">
          <MaterialIcon name="umbrella" size="sm" className="text-indigo-400" />
          <span>{day.precipitationProbability}%</span>
        </div>
        <div className="flex items-center gap-2 text-woodland-text-muted">
          <MaterialIcon name="air" size="sm" className="text-gray-400" />
          <span>{day.windSpeed} km/h</span>
        </div>
      </div>

      <div className="flex justify-between mt-4 pt-4 border-t border-woodland-border-light text-sm text-woodland-text-muted">
        <div className="flex items-center gap-1">
          <MaterialIcon name="wb_sunny" size="sm" className="text-amber-500" />
          <span>{day.sunrise}</span>
        </div>
        <div className="flex items-center gap-1">
          <MaterialIcon name="nights_stay" size="sm" className="text-indigo-400" />
          <span>{day.sunset}</span>
        </div>
      </div>
    </div>
  );
}

export default function WeatherForecast() {
  const { profile } = useUser();
  const p = profile as typeof profile & { garden_latitude?: number; garden_longitude?: number };
  const latitude = p?.garden_latitude ?? -33.9249;
  const longitude = p?.garden_longitude ?? 18.4241;

  const { data: forecast, isLoading, isError } = useWeatherForecast(latitude, longitude);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-woodland-text-main mb-2">
            7-Day Weather Forecast
          </h1>
          <p className="text-woodland-text-muted">
            Plan your garden activities based on the upcoming weather
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-5 border border-woodland-border-light bg-woodland-surface-light animate-pulse"
              >
                <div className="h-6 w-24 bg-woodland-background-light rounded mb-4" />
                <div className="h-12 w-12 bg-woodland-background-light rounded-full mb-4" />
                <div className="h-8 w-16 bg-woodland-background-light rounded" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MaterialIcon name="cloud_off" size="xl" className="text-woodland-text-muted mb-4" />
            <p className="text-lg text-woodland-text-muted">
              Unable to load forecast data
            </p>
            <p className="text-sm text-woodland-text-muted mt-1">
              Please check your internet connection and try again
            </p>
          </div>
        )}

        {forecast && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecast.map((day, index) => (
              <ForecastCard key={day.date.toISOString()} day={day} isToday={index === 0} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
