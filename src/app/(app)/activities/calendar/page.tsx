import Link from "next/link"
import type { Metadata } from "next"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { de } from "date-fns/locale"
import { ChevronLeft, ChevronRight, ListChecks } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { activityListInclude } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CATEGORY_STYLES } from "@/lib/categories"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Kalender – Sommer-Planer" }

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const { month } = await searchParams
  const anchorDate = month ? new Date(`${month}-01T00:00:00`) : new Date()
  const monthStart = startOfMonth(anchorDate)
  const monthEnd = endOfMonth(anchorDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const activities = await prisma.activity.findMany({
    where: { date: { gte: gridStart, lte: gridEnd } },
    include: activityListInclude,
    orderBy: { date: "asc" },
  })

  const activitiesByDay = new Map<string, typeof activities>()
  for (const activity of activities) {
    if (!activity.date) continue
    const key = format(activity.date, "yyyy-MM-dd")
    activitiesByDay.set(key, [...(activitiesByDay.get(key) ?? []), activity])
  }

  const prevMonth = format(subMonths(monthStart, 1), "yyyy-MM")
  const nextMonth = format(addMonths(monthStart, 1), "yyyy-MM")

  const undated = await prisma.activity.count({ where: { date: null } })

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
          <p className="text-sm text-muted-foreground">
            {format(monthStart, "MMMM yyyy", { locale: de })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href={`?month=${prevMonth}`} aria-label="Vorheriger Monat">
              <ChevronLeft />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link href={`?month=${nextMonth}`} aria-label="Nächster Monat">
              <ChevronRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/activities">
              <ListChecks />
              <span className="hidden sm:inline">Liste</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <div className="grid grid-cols-7 border-b bg-muted/50 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd")
            const dayActivities = activitiesByDay.get(key) ?? []
            const inMonth = isSameMonth(day, monthStart)

            return (
              <div
                key={key}
                className={cn(
                  "min-h-24 border-b border-r p-1.5 last:border-r-0 sm:min-h-28 sm:p-2",
                  !inMonth && "bg-muted/30"
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs",
                    !inMonth && "text-muted-foreground/50",
                    isToday(day) && "bg-primary font-semibold text-primary-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
                <div className="mt-1 grid gap-1">
                  {dayActivities.slice(0, 3).map((activity) => (
                    <Link
                      key={activity.id}
                      href={`/activities/${activity.id}`}
                      className={cn(
                        "block truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                        CATEGORY_STYLES[activity.category]
                      )}
                      title={activity.title}
                    >
                      {activity.title}
                    </Link>
                  ))}
                  {dayActivities.length > 3 && (
                    <span className="px-1.5 text-[11px] text-muted-foreground">
                      +{dayActivities.length - 3} weitere
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {undated > 0 && (
        <p className="text-sm text-muted-foreground">
          {undated} Aktivität{undated === 1 ? "" : "en"} noch ohne Termin –{" "}
          <Link href="/activities" className="underline underline-offset-4">
            in der Liste ansehen
          </Link>
        </p>
      )}
    </div>
  )
}
