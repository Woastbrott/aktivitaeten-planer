"use client"

import { useState, useTransition, type FormEvent } from "react"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { createCarpool, type CarpoolFormState } from "@/lib/actions/carpools"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CarpoolForm({ activityId }: { activityId: string }) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<CarpoolFormState>({})
  const [isPending, startTransition] = useTransition()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget

    startTransition(async () => {
      const result = await createCarpool(activityId, {}, formData)
      if (result.error || result.fieldErrors) {
        setState(result)
      } else {
        setState({})
        form.reset()
        setOpen(false)
        toast.success("Fahrgemeinschaft angeboten.")
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setState({})
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus />
          Fahrgemeinschaft
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fahrgemeinschaft anbieten</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          {state.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="carpool-seats">Freie Plätze</Label>
            <Input
              id="carpool-seats"
              name="seats"
              type="number"
              min="1"
              placeholder="z. B. 3"
              required
            />
            {state.fieldErrors?.seats && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.seats[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="carpool-time">Abfahrtszeit (optional)</Label>
            <Input id="carpool-time" name="departureTime" type="datetime-local" />
            {state.fieldErrors?.departureTime && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.departureTime[0]}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Anbieten
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
