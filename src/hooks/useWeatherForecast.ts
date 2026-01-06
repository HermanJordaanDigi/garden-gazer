import { useQuery } from "@tanstack/react-query";

export interface DayForecast {
  date: Date;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  humidity: number;
  sunrise: string;
  sunset: string;
  precipitationProbability: number;
  windSpeed: number;
}

interface ForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    relative_humidity_2m_max: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function fetchForecast(
  latitude: number,
  longitude: number
): Promise<DayForecast[]> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m_max,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch forecast data");
  }

  const data: ForecastResponse = await response.json();

  return data.daily.time.map((dateStr, index) => ({
    date: new Date(dateStr),
    tempMax: Math.round(data.daily.temperature_2m_max[index]),
    tempMin: Math.round(data.daily.temperature_2m_min[index]),
    weatherCode: data.daily.weather_code[index],
    humidity: Math.round(data.daily.relative_humidity_2m_max[index]),
    sunrise: formatTime(data.daily.sunrise[index]),
    sunset: formatTime(data.daily.sunset[index]),
    precipitationProbability: data.daily.precipitation_probability_max[index],
    windSpeed: Math.round(data.daily.wind_speed_10m_max[index]),
  }));
}

export function useWeatherForecast(latitude = -33.9249, longitude = 18.4241) {
  return useQuery({
    queryKey: ["weatherForecast", latitude, longitude],
    queryFn: () => fetchForecast(latitude, longitude),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
  });
}
