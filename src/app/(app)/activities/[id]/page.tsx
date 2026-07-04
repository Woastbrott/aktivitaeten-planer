import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarDays, CalendarPlus, MapPin, Users } from "lucide-react"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { activityDetailInclude } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ParticipationControls } from "@/components/activities/participation-controls"
import { ParticipantList } from "@/components/activities/participant-list"
import { WeatherWidget } from "@/components/activities/weather-widget"
import { CommentsSection } from "@/components/activities/comments-section"
import { ExpensesSection } from "@/components/activities/expenses-section"
import { CarpoolSection } from "@/components/activities/carpool-section"
import { ImageGallery } from "@/components/activities/image-gallery"
import { FlashErrorToast } from "@/components/activities/flash-error-toast"
import { DeleteActivityButton } from "@/components/activities/delete-activity-button"
import { BrainrotText } from "@/components/brainrot-text"

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
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ imageError?: string }>
}) {
  const { id } = await params
  const { imageError } = await searchParams
  const session = await auth()
  const userId = session!.user.id

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: activityDetailInclude,
  })

  if (!activity) notFound()

  const currentParticipation =
    activity.participations.find((p) => p.userId === userId) ?? null
  const goingParticipants = activity.participations
    .filter((p) => p.status === "GOING")
    .map((p) => ({ id: p.user.id, name: p.user.name }))

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      {imageError && <FlashErrorToast message={imageError} />}

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            vorgeschlagen von {activity.createdBy.name}
          </span>
          {userId === activity.createdById && (
            <DeleteActivityButton
              activityId={activity.id}
              activityTitle={activity.title}
            />
          )}
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
            {goingParticipants.length} dabei
          </div>
        </div>

        {activity.date && (
          <Button asChild variant="outline" size="sm" className="w-fit">
            <a href={`/api/activities/${activity.id}/ics`}>
              <CalendarPlus />
              Zum Kalender hinzufügen
            </a>
          </Button>
        )}
      </div>

      <ImageGallery
        activityId={activity.id}
        images={activity.images}
        canManage={userId === activity.createdById}
      />

      {activity.weatherRelevant && (
        <WeatherWidget lat={activity.lat} lng={activity.lng} date={activity.date} />
      )}

      <Card className="grid gap-3 p-4">
        <p className="text-sm font-medium">
          <BrainrotText>Bist du dabei?</BrainrotText>
        </p>
        <ParticipationControls
          activityId={activity.id}
          currentStatus={currentParticipation?.status ?? null}
        />
      </Card>

      <Card className="p-4">
        <ParticipantList participations={activity.participations} />
      </Card>

      <Tabs defaultValue="comments">
        <TabsList className="w-full">
          <TabsTrigger value="comments">Kommentare</TabsTrigger>
          <TabsTrigger value="expenses">Kosten</TabsTrigger>
          <TabsTrigger value="carpool">Fahrgemeinschaft</TabsTrigger>
        </TabsList>
        <TabsContent value="comments" className="pt-4">
          <CommentsSection
            activityId={activity.id}
            comments={activity.comments}
            currentUserName={session!.user.name || session!.user.username}
          />
        </TabsContent>
        <TabsContent value="expenses" className="pt-4">
          <ExpensesSection
            activityId={activity.id}
            expenses={activity.expenses}
            goingParticipants={goingParticipants}
            currentUserId={userId}
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
