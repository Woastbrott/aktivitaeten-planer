"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { ParticipationStatus } from "@prisma/client"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { activitySchema } from "@/lib/validations"

export type ActivityFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function createActivity(
  _prevState: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Nicht eingeloggt." }

  const rawLat = formData.get("lat")
  const rawLng = formData.get("lng")
  const rawCapacity = formData.get("capacity")
  const rawDate = formData.get("date")

  const parsed = activitySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || "",
    category: formData.get("category"),
    location: formData.get("location") || "",
    lat: rawLat ? Number(rawLat) : null,
    lng: rawLng ? Number(rawLng) : null,
    date: rawDate || null,
    capacity: rawCapacity ? Number(rawCapacity) : null,
    weatherRelevant: formData.get("weatherRelevant") === "on",
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { date, ...rest } = parsed.data

  const activity = await prisma.activity.create({
    data: {
      ...rest,
      date: date ? new Date(date) : null,
      createdById: session.user.id,
      participations: {
        create: { userId: session.user.id, status: "GOING" },
      },
    },
  })

  revalidatePath("/activities")
  redirect(`/activities/${activity.id}`)
}

export async function setParticipation(
  activityId: string,
  status: ParticipationStatus
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")

  if (status === "GOING") {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: {
        capacity: true,
        participations: { where: { status: "GOING" }, select: { userId: true } },
      },
    })

    if (!activity) throw new Error("Aktivität nicht gefunden.")

    const alreadyGoing = activity.participations.some(
      (p) => p.userId === session.user.id
    )

    if (
      activity.capacity &&
      !alreadyGoing &&
      activity.participations.length >= activity.capacity
    ) {
      throw new Error("Keine Plätze mehr frei.")
    }
  }

  await prisma.participation.upsert({
    where: {
      userId_activityId: { userId: session.user.id, activityId },
    },
    create: { userId: session.user.id, activityId, status },
    update: { status },
  })

  revalidatePath(`/activities/${activityId}`)
  revalidatePath("/activities")
}
