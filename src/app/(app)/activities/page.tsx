import { Suspense } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { CalendarDays, PartyPopper, Plus } from "lucide-react"
import type { ActivityCategory, Prisma } from "@prisma/client"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { activityListInclude } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ActivityCard } from "@/components/activities/activity-card"
import { ActivityFilters } from "@/components/activities/activity-filters"
import { EmptyState } from "@/components/empty-state"

export const metadata: Metadata = { title: "Aktivitäten – Sommer-Planer" }

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; mine?: string }>
}) {
  const { category, mine } = await searchParams
  const session = await auth()
  const userId = session!.user.id

  const where: Prisma.ActivityWhereInput = {}
  if (category && category !== "all") {
    where.category = category as ActivityCategory
  }
  if (mine === "1") {
    where.participations = { some: { userId } }
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
          <h1 className="text-2xl font-semibold tracking-tight">Aktivitäten</h1>
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
              Neue Aktivität
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
