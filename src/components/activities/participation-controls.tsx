"use client"

import { useTransition } from "react"
import { Check, HelpCircle, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import type { ParticipationStatus } from "@prisma/client"

import { setParticipation } from "@/lib/actions/activities"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const OPTIONS: {
  value: ParticipationStatus
  label: string
  icon: typeof Check
}[] = [
  { value: "GOING", label: "Dabei", icon: Check },
  { value: "MAYBE", label: "Vielleicht", icon: HelpCircle },
  { value: "DECLINED", label: "Abgesagt", icon: X },
]

export function ParticipationControls({
  activityId,
  currentStatus,
}: {
  activityId: string
  currentStatus: ParticipationStatus | null
}) {
  const [isPending, startTransition] = useTransition()

  function handleClick(status: ParticipationStatus) {
    startTransition(async () => {
      try {
        await setParticipation(activityId, status)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Etwas ist schiefgelaufen."
        )
      }
    })
  }

  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => {
        const isActive = currentStatus === option.value
        return (
          <Button
            key={option.value}
            type="button"
            variant={isActive ? "default" : "outline"}
            size="sm"
            disabled={isPending}
            onClick={() => handleClick(option.value)}
            className={cn(
              "flex-1",
              isActive &&
                option.value === "DECLINED" &&
                "bg-destructive/90 hover:bg-destructive"
            )}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <option.icon />
            )}
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
