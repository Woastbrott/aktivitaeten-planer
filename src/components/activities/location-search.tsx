"use client"

import { useState, useTransition } from "react"
import { Loader2, MapPin, Search } from "lucide-react"

import { searchLocation } from "@/lib/actions/geocode"
import type { GeocodeResult } from "@/lib/geocode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LocationSearch({
  location,
  coords,
  onLocationChange,
  onCoordsChange,
}: {
  location: string
  coords: { lat: number; lng: number } | null
  onLocationChange: (value: string) => void
  onCoordsChange: (coords: { lat: number; lng: number } | null) => void
}) {
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [isPending, startTransition] = useTransition()
  const [searched, setSearched] = useState(false)

  function handleSearch() {
    if (location.trim().length < 2) return
    startTransition(async () => {
      const found = await searchLocation(location)
      setResults(found)
      setSearched(true)
    })
  }

  function pick(result: GeocodeResult) {
    const label = [result.name, result.admin1, result.country]
      .filter(Boolean)
      .join(", ")
    onLocationChange(label)
    onCoordsChange({ lat: result.lat, lng: result.lng })
    setResults([])
    setSearched(false)
  }

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <Input
          id="location"
          name="location"
          placeholder="z. B. Bodensee, Konstanz"
          value={location}
          onChange={(e) => {
            onLocationChange(e.target.value)
            onCoordsChange(null)
            setResults([])
            setSearched(false)
          }}
          onKeyDown={(e) => {
            // Prevent Enter from submitting the surrounding activity form —
            // it should trigger the location search instead.
            if (e.key === "Enter") {
              e.preventDefault()
              handleSearch()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={isPending || location.trim().length < 2}
          className="shrink-0"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Search />}
          <span className="hidden sm:inline">Ort suchen</span>
        </Button>
      </div>

      {coords && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 text-primary" />
          Koordinaten gefunden – Wetteranzeige möglich
        </p>
      )}

      {results.length > 0 && (
        <div className="grid gap-1 rounded-lg border bg-popover p-1 shadow-sm">
          {results.map((result, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(result)}
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted"
            >
              <MapPin className="size-4 shrink-0 text-muted-foreground" />
              <span>
                {result.name}
                {result.admin1 && (
                  <span className="text-muted-foreground">
                    {" "}
                    · {result.admin1}
                  </span>
                )}
                {result.country && (
                  <span className="text-muted-foreground">
                    , {result.country}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {searched && results.length === 0 && !isPending && (
        <p className="text-xs text-muted-foreground">
          Kein Ort gefunden. Du kannst den Namen trotzdem frei eingeben.
        </p>
      )}

      {coords && (
        <>
          <input type="hidden" name="lat" value={coords.lat} />
          <input type="hidden" name="lng" value={coords.lng} />
        </>
      )}
    </div>
  )
}
