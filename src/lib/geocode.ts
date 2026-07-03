export type GeocodeResult = {
  name: string
  admin1?: string
  country?: string
  lat: number
  lng: number
}

export async function geocodeLocation(query: string): Promise<GeocodeResult[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search")
  url.searchParams.set("name", trimmed)
  url.searchParams.set("count", "5")
  url.searchParams.set("language", "de")

  try {
    const res = await fetch(url)
    if (!res.ok) return []

    const data = await res.json()
    const results = data?.results ?? []

    return results.map(
      (r: {
        name: string
        admin1?: string
        country?: string
        latitude: number
        longitude: number
      }) => ({
        name: r.name,
        admin1: r.admin1,
        country: r.country,
        lat: r.latitude,
        lng: r.longitude,
      })
    )
  } catch {
    return []
  }
}
