import { CloudOff } from "lucide-react"

import { getDailyWeather, weatherCodeLabel } from "@/lib/weather"
import { WeatherIcon } from "@/components/activities/weather-icon"
import { cn } from "@/lib/utils"

export async function WeatherWidget({
  lat,
  lng,
  date,
  compact = false,
}: {
  lat: number | null
  lng: number | null
  date: Date | null
  compact?: boolean
}) {
  if (!lat || !lng || !date) {
    if (compact) return null
    return (
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <CloudOff className="size-4" />
        Wetter wird angezeigt, sobald Ort und Datum feststehen.
      </p>
    )
  }

  const isoDate = date.toISOString().slice(0, 10)
  const result = await getDailyWeather(lat, lng, isoDate)

  if (result.status === "out-of-range") {
    if (compact) return null
    return (
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <CloudOff className="size-4" />
        Die Vorhersage ist erst ab 15 Tagen vorher verfügbar.
      </p>
    )
  }

  if (result.status === "unavailable") {
    if (compact) return null
    return (
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <CloudOff className="size-4" />
        Wetterdaten momentan nicht verfügbar.
      </p>
    )
  }

  const { weather } = result

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
        <WeatherIcon code={weather.weatherCode} className="size-3.5" />
        <span>{Math.round(weather.tempMax)}°</span>
        {weather.precipitationProbability !== null &&
          weather.precipitationProbability > 20 && (
            <span className="text-secondary-foreground/70">
              · {weather.precipitationProbability}%
            </span>
          )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-secondary/40 p-3.5">
      <WeatherIcon code={weather.weatherCode} className="size-8 text-primary" />
      <div className="grid gap-0.5">
        <p className="text-sm font-medium">
          {weatherCodeLabel(weather.weatherCode)}
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.round(weather.tempMin)}° – {Math.round(weather.tempMax)}°
          {weather.precipitationProbability !== null && (
            <span
              className={cn(
                weather.precipitationProbability > 40 && "text-primary"
              )}
            >
              {" "}
              · {weather.precipitationProbability}% Regen
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
