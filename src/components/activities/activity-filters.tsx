"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Loader2, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useBrainrot } from "@/components/brainrot-provider"
import { brainrotLabel } from "@/lib/brainrot"
import { cn } from "@/lib/utils"

export function ActivityFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { active: brainrot } = useBrainrot()

  const mineOnly = searchParams.get("mine") === "1"

  function toggleMine() {
    const params = new URLSearchParams(searchParams.toString())
    if (mineOnly) {
      params.delete("mine")
    } else {
      params.set("mine", "1")
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      className={cn(
        "transition-colors duration-150",
        mineOnly && "border-primary bg-primary/10 text-primary"
      )}
      onClick={toggleMine}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <UserRound />}
      {brainrot ? brainrotLabel("Meine Aktivitäten") : "Meine Aktivitäten"}
    </Button>
  )
}
