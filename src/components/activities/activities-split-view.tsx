"use client"

import { useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { List, MapIcon, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"
import { cn } from "@/lib/utils"
import type { ActivityMapPoint } from "@/components/activities/activities-map"

const ActivitiesMap = dynamic(
  () => import("@/components/activities/activities-map").then((m) => m.ActivitiesMap),
  { ssr: false, loading: () => <Skeleton className="h-full w-full rounded-2xl" /> }
)

export function ActivitiesSplitView({
  points,
  total,
  children,
}: {
  points: ActivityMapPoint[]
  total: number
  children: ReactNode
}) {
  const [mobileView, setMobileView] = useState<"list" | "map">("list")
  const withoutLocation = total - points.length

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
      <div className="flex gap-1 rounded-full border bg-muted/40 p-1 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMobileView("list")}
          className={cn(
            "flex-1 rounded-full",
            mobileView === "list" && "bg-card shadow-sm"
          )}
        >
          <List />
          Liste
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMobileView("map")}
          className={cn(
            "flex-1 rounded-full",
            mobileView === "map" && "bg-card shadow-sm"
          )}
        >
          <MapIcon />
          Karte
        </Button>
      </div>

      <div className={cn(mobileView === "map" && "hidden", "lg:block")}>
        {children}
      </div>

      <div
        className={cn(
          "grid gap-2",
          mobileView === "list" && "hidden",
          "lg:sticky lg:top-20 lg:block"
        )}
      >
        <div className="h-[70vh] overflow-hidden rounded-2xl ring-1 ring-foreground/10 lg:h-[calc(100vh-6rem)]">
          {points.length === 0 ? (
            <div className="flex h-full items-center justify-center bg-muted/30">
              <EmptyState
                icon={MapPin}
                title="Keine Standorte hinterlegt"
                description="Sobald Aktivitäten einen ausgewählten Ort haben, erscheinen sie hier auf der Karte."
              />
            </div>
          ) : (
            <ActivitiesMap points={points} />
          )}
        </div>
        {points.length > 0 && withoutLocation > 0 && (
          <p className="text-xs text-muted-foreground">
            {withoutLocation} Aktivität{withoutLocation === 1 ? "" : "en"} ohne
            Standort {withoutLocation === 1 ? "wird" : "werden"} hier nicht
            angezeigt.
          </p>
        )}
      </div>
    </div>
  )
}
