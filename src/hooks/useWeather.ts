import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    is_day: number;
  };
}

// Weather code to icon mapping based on WMO codes
// https://open-meteo.com/en/docs#weathervariables
export function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "wb_sunny" : "nights_stay";
  if (code <= 3) return isDay ? "partly_cloudy_day" : "nights_stay";
  if (code <= 49) return "foggy";
  if (code <= 69) return "rainy";
  if (code <= 79) return "ac_unit";
  if (code <= 99) return "thunderstorm";
  return "wb_cloudy";
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 99) return "Thunderstorm";
  return "Cloudy";
}

async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,is_day`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data: WeatherResponse = await response.json();

  return {
    temperature: Math.round(data.current.temperature_2m),
    humidity: Math.round(data.current.relative_humidity_2m),
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
  };
}

export function useWeather(latitude = -33.9249, longitude = 18.4241) {
  // Default coordinates: Cape Town, South Africa
  return useQuery({
    queryKey: ["weather", latitude, longitude],
    queryFn: () => fetchWeather(latitude, longitude),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}
