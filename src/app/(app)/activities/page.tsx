import { Suspense } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { CalendarDays, PartyPopper, Plus } from "lucide-react"
import type { Prisma } from "@prisma/client"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { activityListInclude } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ActivityCard } from "@/components/activities/activity-card"
import { ActivityFilters } from "@/components/activities/activity-filters"
import { ActivitiesSplitView } from "@/components/activities/activities-split-view"
import { EmptyState } from "@/components/empty-state"
import { BrainrotText } from "@/components/brainrot-text"

export const metadata: Metadata = { title: "Aktivitäten – Sommer-Planer" }

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ mine?: string; termin?: string }>
}) {
  const { mine, termin } = await searchParams
  const session = await auth()
  const userId = session!.user.id

  const where: Prisma.ActivityWhereInput = {}
  if (mine === "1") {
    where.participations = { some: { userId } }
  }
  if (termin === "offen") {
    where.date = null
  }

  const activities = await prisma.activity.findMany({
    where,
    include: activityListInclude,
    orderBy: [{ date: "asc" }, { createdAt: "desc" }],
  })

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            <BrainrotText>Aktivitäten</BrainrotText>
          </h1>
          <p className="text-sm text-muted-foreground">
            {activities.length} Aktivität{activities.length === 1 ? "" : "en"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon" className="md:hidden">
            <Link href="/activities/calendar" aria-label="Kalenderansicht">
              <CalendarDays />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/activities/new">
              <Plus />
              <BrainrotText>Neue Aktivität</BrainrotText>
            </Link>
          </Button>
        </div>
      </div>

      <Suspense>
        <ActivityFilters />
      </Suspense>

      {activities.length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="Noch keine Aktivitäten"
          description="Sei die erste Person, die eine Sommer-Aktivität vorschlägt."
          actionLabel="Aktivität vorschlagen"
          actionHref="/activities/new"
        />
      ) : (
        <ActivitiesSplitView
          points={activities
            .filter(
              (a): a is typeof a & { lat: number; lng: number } =>
                a.lat != null && a.lng != null
            )
            .map((a) => ({ id: a.id, title: a.title, lat: a.lat, lng: a.lng }))}
          total={activities.length}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
                style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
              >
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        </ActivitiesSplitView>
      )}
    </div>
  )
}
