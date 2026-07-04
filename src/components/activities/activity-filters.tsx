"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { CalendarOff, Loader2, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useBrainrot } from "@/components/brainrot-provider"
import { brainrotLabel } from "@/lib/brainrot"
import { cn } from "@/lib/utils"

function pillClass(active: boolean) {
  return cn(
    "rounded-full px-3.5 transition-colors duration-150",
    active
      ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
      : "hover:border-foreground/30"
  )
}

export function ActivityFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { active: brainrot } = useBrainrot()

  const mineOnly = searchParams.get("mine") === "1"
  const noDateOnly = searchParams.get("termin") === "offen"

  function toggleParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        className={pillClass(mineOnly)}
        onClick={() => toggleParam("mine", "1")}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <UserRound />}
        {brainrot ? brainrotLabel("Meine Aktivitäten") : "Meine Aktivitäten"}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        className={pillClass(noDateOnly)}
        onClick={() => toggleParam("termin", "offen")}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <CalendarOff />}
        Ohne Termin
      </Button>
    </div>
  )
}
