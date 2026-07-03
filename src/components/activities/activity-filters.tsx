"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ActivityFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const mineOnly = searchParams.get("mine") === "1"

  function toggleMine() {
    const params = new URLSearchParams(searchParams.toString())
    if (mineOnly) {
      params.delete("mine")
    } else {
      params.set("mine", "1")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(mineOnly && "border-primary bg-primary/10 text-primary")}
      onClick={toggleMine}
    >
      <UserRound />
      Meine Aktivitäten
    </Button>
  )
}
