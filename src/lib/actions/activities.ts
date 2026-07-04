"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { ParticipationStatus } from "@prisma/client"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { activitySchema } from "@/lib/validations"
import { saveActivityImages, deleteActivityImageFile } from "@/lib/uploads"

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
  const rawDate = formData.get("date")

  const parsed = activitySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || "",
    location: formData.get("location") || "",
    lat: rawLat ? Number(rawLat) : null,
    lng: rawLng ? Number(rawLng) : null,
    date: rawDate || null,
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

  const imageFiles = formData.getAll("images").filter(
    (entry): entry is File => entry instanceof File && entry.size > 0
  )
  let imageErrors: string[] = []
  if (imageFiles.length > 0) {
    const result = await saveActivityImages(activity.id, imageFiles)
    imageErrors = result.errors
  }

  revalidatePath("/activities")
  redirect(
    imageErrors.length > 0
      ? `/activities/${activity.id}?imageError=${encodeURIComponent(imageErrors.join(" "))}`
      : `/activities/${activity.id}`
  )
}

export async function setParticipation(
  activityId: string,
  status: ParticipationStatus
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")

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

export async function deleteActivity(activityId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    select: { createdById: true, images: { select: { path: true } } },
  })
  if (!activity) throw new Error("Aktivität nicht gefunden.")
  if (activity.createdById !== session.user.id) {
    throw new Error("Nur die erstellende Person kann die Aktivität löschen.")
  }

  await Promise.all(
    activity.images.map((image) => deleteActivityImageFile(image.path))
  )
  await prisma.activity.delete({ where: { id: activityId } })

  revalidatePath("/activities")
  redirect("/activities")
}
