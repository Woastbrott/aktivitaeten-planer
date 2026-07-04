"use client"

import { useTransition } from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Car, Clock, Trash2, UserRound } from "lucide-react"
import { toast } from "sonner"

import { deleteCarpool, joinCarpool, leaveCarpool } from "@/lib/actions/carpools"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initials } from "@/lib/initials"
import { CarpoolForm } from "@/components/activities/carpool-form"
import type { ActivityDetail } from "@/lib/types"

export function CarpoolSection({
  activityId,
  carpools,
  goingParticipants,
  currentUserId,
}: {
  activityId: string
  carpools: ActivityDetail["carpools"]
  goingParticipants: { id: string; name: string }[]
  currentUserId: string
}) {
  const [isPending, startTransition] = useTransition()

  const userDrivesHere = carpools.some((c) => c.driverId === currentUserId)

  const assignedIds = new Set<string>()
  for (const carpool of carpools) {
    assignedIds.add(carpool.driverId)
    for (const passenger of carpool.passengers) assignedIds.add(passenger.userId)
  }
  const needsRide = goingParticipants.filter((p) => !assignedIds.has(p.id))

  function run(action: () => Promise<void>, successMessage?: string) {
    startTransition(async () => {
      try {
        await action()
        if (successMessage) toast.success(successMessage)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Etwas ist schiefgelaufen."
        )
      }
    })
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Car className="size-4.5" />
          Fahrgemeinschaften
        </h2>
        {!userDrivesHere && <CarpoolForm activityId={activityId} />}
      </div>

      {carpools.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Noch keine Fahrgemeinschaft angeboten.
        </p>
      ) : (
        <ul className="grid gap-3">
          {carpools.map((carpool) => {
            const isDriver = carpool.driverId === currentUserId
            const isPassenger = carpool.passengers.some(
              (p) => p.userId === currentUserId
            )
            const full = carpool.passengers.length >= carpool.seats

            return (
              <li
                key={carpool.id}
                className="grid animate-in fade-in slide-in-from-bottom-1 gap-2.5 rounded-lg border p-3.5 duration-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">
                        {initials(carpool.driver.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <p className="text-sm font-medium">
                        {carpool.driver.name}
                        {isDriver && " (du)"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {carpool.passengers.length} / {carpool.seats} Plätze belegt
                      </p>
                    </div>
                  </div>

                  {isDriver && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending}
                      onClick={() =>
                        run(
                          () => deleteCarpool(activityId, carpool.id),
                          "Fahrgemeinschaft gelöscht."
                        )
                      }
                      aria-label="Fahrgemeinschaft löschen"
                    >
                      <Trash2 className="text-muted-foreground" />
                    </Button>
                  )}
                </div>

                {carpool.departureTime && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" />
                    {format(carpool.departureTime, "EEE, d. MMM · HH:mm 'Uhr'", {
                      locale: de,
                    })}
                  </div>
                )}

                {carpool.passengers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {carpool.passengers.map((p) => (
                      <span
                        key={p.userId}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs"
                      >
                        {p.user.name}
                      </span>
                    ))}
                  </div>
                )}

                {!isDriver && (
                  <Button
                    type="button"
                    variant={isPassenger ? "outline" : "secondary"}
                    size="sm"
                    disabled={isPending || (!isPassenger && full)}
                    onClick={() =>
                      run(
                        () =>
                          isPassenger
                            ? leaveCarpool(activityId, carpool.id)
                            : joinCarpool(activityId, carpool.id),
                        isPassenger
                          ? "Mitfahrt storniert."
                          : "Mitfahrt bestätigt."
                      )
                    }
                  >
                    {isPassenger
                      ? "Nicht mehr mitfahren"
                      : full
                        ? "Voll belegt"
                        : "Mitfahren"}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {needsRide.length > 0 && (
        <div className="grid gap-1.5 rounded-lg bg-secondary/40 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <UserRound className="size-3.5" />
            Braucht noch eine Mitfahrgelegenheit
          </p>
          <div className="flex flex-wrap gap-1.5">
            {needsRide.map((p) => (
              <span key={p.id} className="rounded-full bg-background px-2 py-0.5 text-xs">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
