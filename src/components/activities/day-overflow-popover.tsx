"use client"

import Link from "next/link"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DayOverflowPopover({
  day,
  activities,
}: {
  day: string
  activities: { id: string; title: string }[]
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full rounded-md px-1.5 py-0.5 text-left text-[11px] text-muted-foreground underline-offset-2 transition-colors hover:bg-muted hover:text-foreground hover:underline"
        >
          +{activities.length} weitere
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1.5">
        <p className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
          {day}
        </p>
        <div className="grid gap-0.5">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              className="truncate rounded-md px-1.5 py-1 text-sm transition-colors hover:bg-muted"
              title={activity.title}
            >
              {activity.title}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
