const FORECAST_DAYS_AHEAD = 15

export type DailyWeather = {
  date: string
  tempMax: number
  tempMin: number
  weatherCode: number
  precipitationProbability: number | null
}

export type WeatherResult =
  | { status: "ok"; weather: DailyWeather }
  | { status: "out-of-range" }
  | { status: "unavailable" }

// WMO weather interpretation codes -> short German label
export const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Klarer Himmel",
  1: "Überwiegend klar",
  2: "Teilweise bewölkt",
  3: "Bedeckt",
  45: "Nebel",
  48: "Reifnebel",
  51: "Leichter Nieselregen",
  53: "Nieselregen",
  55: "Starker Nieselregen",
  61: "Leichter Regen",
  63: "Regen",
  65: "Starker Regen",
  71: "Leichter Schneefall",
  73: "Schneefall",
  75: "Starker Schneefall",
  80: "Leichte Regenschauer",
  81: "Regenschauer",
  82: "Heftige Regenschauer",
  95: "Gewitter",
  96: "Gewitter mit Hagel",
  99: "Schweres Gewitter mit Hagel",
}

export function weatherCodeLabel(code: number): string {
  return WEATHER_CODE_LABELS[code] ?? "Unbekannt"
}

export async function getDailyWeather(
  lat: number,
  lng: number,
  isoDate: string
): Promise<WeatherResult> {
  const targetDate = new Date(isoDate + "T00:00:00Z")
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const diffDays = Math.round(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 0 || diffDays > FORECAST_DAYS_AHEAD) {
    return { status: "out-of-range" }
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", lat.toString())
  url.searchParams.set("longitude", lng.toString())
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max"
  )
  url.searchParams.set("timezone", "auto")
  url.searchParams.set("forecast_days", (FORECAST_DAYS_AHEAD + 1).toString())

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return { status: "unavailable" }

    const data = await res.json()
    const dates: string[] = data?.daily?.time ?? []
    const index = dates.indexOf(isoDate)
    if (index === -1) return { status: "unavailable" }

    return {
      status: "ok",
      weather: {
        date: isoDate,
        tempMax: data.daily.temperature_2m_max[index],
        tempMin: data.daily.temperature_2m_min[index],
        weatherCode: data.daily.weathercode[index],
        precipitationProbability:
          data.daily.precipitation_probability_max?.[index] ?? null,
      },
    }
  } catch {
    return { status: "unavailable" }
  }
}
