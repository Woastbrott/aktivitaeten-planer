import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarDays, MapPin, Users } from "lucide-react"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { activityDetailInclude } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_STYLES } from "@/lib/categories"
import { ParticipationControls } from "@/components/activities/participation-controls"
import { ParticipantList } from "@/components/activities/participant-list"
import { WeatherWidget } from "@/components/activities/weather-widget"
import { CommentsSection } from "@/components/activities/comments-section"
import { ExpensesSection } from "@/components/activities/expenses-section"
import { CarpoolSection } from "@/components/activities/carpool-section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: { title: true },
  })
  return { title: activity ? `${activity.title} – Sommer-Planer` : "Sommer-Planer" }
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const userId = session!.user.id

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: activityDetailInclude,
  })

  if (!activity) notFound()

  const Icon = CATEGORY_ICONS[activity.category]
  const currentParticipation =
    activity.participations.find((p) => p.userId === userId) ?? null
  const goingParticipants = activity.participations
    .filter((p) => p.status === "GOING")
    .map((p) => ({ id: p.user.id, name: p.user.name }))

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge
            className={`gap-1 border-none font-medium ${CATEGORY_STYLES[activity.category]}`}
          >
            <Icon className="size-3.5" />
            {CATEGORY_LABELS[activity.category]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            vorgeschlagen von {activity.createdBy.name}
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {activity.title}
        </h1>

        {activity.description && (
          <p className="whitespace-pre-wrap text-muted-foreground">
            {activity.description}
          </p>
        )}

        <div className="grid gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4 shrink-0" />
            {activity.date
              ? format(activity.date, "EEEE, d. MMMM yyyy · HH:mm 'Uhr'", {
                  locale: de,
                })
              : "Termin noch offen"}
          </div>
          {activity.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" />
              {activity.location}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="size-4 shrink-0" />
            {goingParticipants.length}
            {activity.capacity ? ` / ${activity.capacity}` : ""} dabei
          </div>
        </div>
      </div>

      {activity.weatherRelevant && (
        <WeatherWidget lat={activity.lat} lng={activity.lng} date={activity.date} />
      )}

      <Card className="grid gap-3 p-4">
        <p className="text-sm font-medium">Bist du dabei?</p>
        <ParticipationControls
          activityId={activity.id}
          currentStatus={currentParticipation?.status ?? null}
        />
      </Card>

      <Card className="p-4">
        <ParticipantList
          participations={activity.participations}
          capacity={activity.capacity}
        />
      </Card>

      <Tabs defaultValue="comments">
        <TabsList className="w-full">
          <TabsTrigger value="comments">Kommentare</TabsTrigger>
          <TabsTrigger value="expenses">Kosten</TabsTrigger>
          <TabsTrigger value="carpool">Fahrgemeinschaft</TabsTrigger>
        </TabsList>
        <TabsContent value="comments" className="pt-4">
          <CommentsSection activityId={activity.id} comments={activity.comments} />
        </TabsContent>
        <TabsContent value="expenses" className="pt-4">
          <ExpensesSection
            activityId={activity.id}
            expenses={activity.expenses}
            goingParticipants={goingParticipants}
          />
        </TabsContent>
        <TabsContent value="carpool" className="pt-4">
          <CarpoolSection
            activityId={activity.id}
            carpools={activity.carpools}
            goingParticipants={goingParticipants}
            currentUserId={userId}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
