"use client"

import { useActionState, useState } from "react"
import { Loader2 } from "lucide-react"

import { createActivity, type ActivityFormState } from "@/lib/actions/activities"
import { CATEGORY_LABELS, CATEGORY_OPTIONS } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="category">Kategorie</Label>
          <Select name="category" defaultValue="SONSTIGES" required>
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="capacity">Teilnehmer-Limit (optional)</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            placeholder="z. B. 10"
          />
          {state.fieldErrors?.capacity && (
            <p className="text-sm text-destructive">
              {state.fieldErrors.capacity[0]}
            </p>
          )}
        </div>
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

      <Button type="submit" disabled={isPending} size="lg">
        {isPending && <Loader2 className="animate-spin" />}
        Aktivität vorschlagen
      </Button>
    </form>
  )
}
