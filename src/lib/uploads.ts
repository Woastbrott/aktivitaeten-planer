import { put, del } from "@vercel/blob"
import { randomUUID } from "crypto"

import { prisma } from "@/lib/prisma"

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
export const MAX_IMAGES_PER_ACTIVITY = 8

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
}

function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Nur JPEG-, PNG-, WebP- oder GIF-Bilder sind erlaubt."
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Bilder dürfen höchstens 5 MB groß sein."
  }
  return null
}

async function writeImageFile(activityId: string, file: File): Promise<string> {
  const extension = EXTENSION_BY_TYPE[file.type] ?? "jpg"
  const filename = `${randomUUID()}.${extension}`

  const blob = await put(`activities/${activityId}/${filename}`, file, {
    access: "public",
    addRandomSuffix: false,
  })

  return blob.url
}

/**
 * Validates and stores image files for an activity, skipping invalid ones
 * instead of failing the whole batch. Callers decide whether to surface
 * `errors` to the user.
 */
export async function saveActivityImages(
  activityId: string,
  files: File[]
): Promise<{ saved: number; errors: string[] }> {
  const errors: string[] = []
  let saved = 0

  const existingCount = await prisma.activityImage.count({ where: { activityId } })
  const remainingSlots = Math.max(0, MAX_IMAGES_PER_ACTIVITY - existingCount)

  if (files.length > remainingSlots) {
    errors.push(
      `Maximal ${MAX_IMAGES_PER_ACTIVITY} Bilder pro Aktivität – ${files.length - remainingSlots} Bild(er) wurden nicht hochgeladen.`
    )
  }

  for (const file of files.slice(0, remainingSlots)) {
    const validationError = validateImageFile(file)
    if (validationError) {
      errors.push(`${file.name}: ${validationError}`)
      continue
    }

    const imagePath = await writeImageFile(activityId, file)
    await prisma.activityImage.create({ data: { activityId, path: imagePath } })
    saved++
  }

  return { saved, errors }
}

export async function deleteActivityImageFile(imagePath: string): Promise<void> {
  await del(imagePath).catch(() => {})
}
