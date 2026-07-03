"use client"

import { useActionState, useState } from "react"
import { ImagePlus, Loader2 } from "lucide-react"

import { createActivity, type ActivityFormState } from "@/lib/actions/activities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { LocationSearch } from "@/components/activities/location-search"

const initialState: ActivityFormState = {}

export function ActivityForm() {
  const [state, formAction, isPending] = useActionState(
    createActivity,
    initialState
  )
  const [location, setLocation] = useState("")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  )
  const [dateUnknown, setDateUnknown] = useState(false)

  return (
    <form action={formAction} className="grid gap-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="title">Titel</Label>
        <Input
          id="title"
          name="title"
          placeholder="z. B. Wanderung zum Aussichtspunkt"
          required
        />
        {state.fieldErrors?.title && (
          <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Worum geht's? Was sollte man mitbringen?"
          rows={4}
        />
      </div>

      <div className="grid gap-2">
        <Label>Ort</Label>
        <LocationSearch
          location={location}
          coords={coords}
          onLocationChange={setLocation}
          onCoordsChange={setCoords}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="date">Datum &amp; Uhrzeit</Label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="size-3.5 rounded border-input"
              checked={dateUnknown}
              onChange={(e) => setDateUnknown(e.target.checked)}
            />
            Termin steht noch nicht fest
          </label>
        </div>
        {!dateUnknown && (
          <Input id="date" name="date" type="datetime-local" />
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3.5">
        <div className="grid gap-0.5">
          <Label htmlFor="weatherRelevant">Wetter ist wichtig</Label>
          <p className="text-xs text-muted-foreground">
            Zeigt die Vorhersage an, sobald Ort und Datum feststehen (Outdoor-Aktivitäten)
          </p>
        </div>
        <Switch id="weatherRelevant" name="weatherRelevant" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="images" className="flex items-center gap-1.5">
          <ImagePlus className="size-4" />
          Bilder (optional)
        </Label>
        <Input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
        />
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP oder GIF, bis 5 MB pro Bild, max. 8 Bilder.
        </p>
      </div>

      <Button type="submit" disabled={isPending} size="lg">
        {isPending && <Loader2 className="animate-spin" />}
        Aktivität vorschlagen
      </Button>
    </form>
  )
}
