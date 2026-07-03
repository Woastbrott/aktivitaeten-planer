"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

import { CATEGORY_LABELS, CATEGORY_OPTIONS } from "@/lib/categories"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ActivityFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const category = searchParams.get("category") ?? "all"
  const mineOnly = searchParams.get("mine") === "1"

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === "all" || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={category}
        onValueChange={(value) => updateParam("category", value)}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Alle Kategorien" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Kategorien</SelectItem>
          {CATEGORY_OPTIONS.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        className={cn(mineOnly && "border-primary bg-primary/10 text-primary")}
        onClick={() => updateParam("mine", mineOnly ? null : "1")}
      >
        Meine Aktivitäten
      </Button>
    </div>
  )
}
