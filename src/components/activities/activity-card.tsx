import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarDays, MapPin, Users } from "lucide-react"

import { Card } from "@/components/ui/card"
import { ParticipantAvatars } from "@/components/activities/participant-avatars"
import { WeatherWidget } from "@/components/activities/weather-widget"
import type { ActivityListItem } from "@/lib/types"

export function ActivityCard({ activity }: { activity: ActivityListItem }) {
  const going = activity.participations.filter((p) => p.status === "GOING")
  const coverImage = activity.images[0]

  return (
    <Link href={`/activities/${activity.id}`} className="group block">
      <Card className="h-full gap-3 overflow-hidden p-4 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        {coverImage && (
          <div className="relative -mx-4 -mt-4 aspect-video overflow-hidden bg-muted">
            <Image
              src={coverImage.path}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        {activity.weatherRelevant && (
          <div className="flex justify-end">
            <WeatherWidget
              lat={activity.lat}
              lng={activity.lng}
              date={activity.date}
              compact
            />
          </div>
        )}

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
          </div>
        </div>
      </Card>
    </Link>
  )
}
