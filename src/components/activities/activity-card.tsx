import Link from "next/link"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarDays, MapPin, Users } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_STYLES } from "@/lib/categories"
import { ParticipantAvatars } from "@/components/activities/participant-avatars"
import { WeatherWidget } from "@/components/activities/weather-widget"
import type { ActivityListItem } from "@/lib/types"

export function ActivityCard({ activity }: { activity: ActivityListItem }) {
  const Icon = CATEGORY_ICONS[activity.category]
  const going = activity.participations.filter((p) => p.status === "GOING")

  return (
    <Link href={`/activities/${activity.id}`} className="group block">
      <Card className="h-full gap-3 overflow-hidden p-4 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <Badge
            className={`gap-1 border-none font-medium ${CATEGORY_STYLES[activity.category]}`}
          >
            <Icon className="size-3.5" />
            {CATEGORY_LABELS[activity.category]}
          </Badge>

          {activity.weatherRelevant && (
            <WeatherWidget
              lat={activity.lat}
              lng={activity.lng}
              date={activity.date}
              compact
            />
          )}
        </div>

        <div className="grid gap-1">
          <h3 className="line-clamp-1 font-semibold tracking-tight">
            {activity.title}
          </h3>
          {activity.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {activity.description}
            </p>
          )}
        </div>

        <div className="grid gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4 shrink-0" />
            {activity.date ? (
              format(activity.date, "EEE, d. MMM · HH:mm 'Uhr'", {
                locale: de,
              })
            ) : (
              "Termin noch offen"
            )}
          </div>
          {activity.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" />
              <span className="line-clamp-1">{activity.location}</span>
            </div>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between border-t pt-3">
          <ParticipantAvatars names={going.map((p) => p.user.name)} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {going.length}
            {activity.capacity ? ` / ${activity.capacity}` : ""}
          </div>
        </div>
      </Card>
    </Link>
  )
}
