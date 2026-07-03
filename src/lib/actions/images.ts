"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { saveActivityImages, deleteActivityImageFile } from "@/lib/uploads"

export type AddImagesState = {
  error?: string
}

async function assertIsCreator(activityId: string, userId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    select: { createdById: true },
  })
  if (!activity) throw new Error("Aktivität nicht gefunden.")
  if (activity.createdById !== userId) {
    throw new Error("Nur die erstellende Person kann Bilder verwalten.")
  }
}

export async function addActivityImages(
  activityId: string,
  _prevState: AddImagesState,
  formData: FormData
): Promise<AddImagesState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Nicht eingeloggt." }

  try {
    await assertIsCreator(activityId, session.user.id)
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Fehler." }
  }

  const imageFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  if (imageFiles.length === 0) {
    return { error: "Bitte wähle mindestens ein Bild aus." }
  }

  const { errors } = await saveActivityImages(activityId, imageFiles)

  revalidatePath(`/activities/${activityId}`)
  revalidatePath("/activities")

  return errors.length > 0 ? { error: errors.join(" ") } : {}
}

export async function deleteActivityImage(activityId: string, imageId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")

  await assertIsCreator(activityId, session.user.id)

  const image = await prisma.activityImage.findUnique({ where: { id: imageId } })
  if (!image || image.activityId !== activityId) {
    throw new Error("Bild nicht gefunden.")
  }

  await prisma.activityImage.delete({ where: { id: imageId } })
  await deleteActivityImageFile(image.path)

  revalidatePath(`/activities/${activityId}`)
  revalidatePath("/activities")
}
