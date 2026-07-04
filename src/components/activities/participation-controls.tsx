"use client"

import { useOptimistic, useTransition } from "react"
import { Check, HelpCircle, X } from "lucide-react"
import { toast } from "sonner"
import type { ParticipationStatus } from "@prisma/client"

import { setParticipation } from "@/lib/actions/activities"
import { Button } from "@/components/ui/button"
import { useBrainrot } from "@/components/brainrot-provider"
import { brainrotLabel } from "@/lib/brainrot"
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
  const [, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus)
  const { active: brainrot } = useBrainrot()

  function handleClick(status: ParticipationStatus) {
    startTransition(async () => {
      setOptimisticStatus(status)
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
        const isActive = optimisticStatus === option.value
        return (
          <Button
            key={option.value}
            type="button"
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleClick(option.value)}
            className={cn(
              "flex-1 transition-all duration-150 active:scale-95",
              isActive &&
                option.value === "DECLINED" &&
                "bg-destructive/90 hover:bg-destructive"
            )}
          >
            <option.icon />
            {brainrot ? brainrotLabel(option.label) : option.label}
          </Button>
        )
      })}
    </div>
  )
}
