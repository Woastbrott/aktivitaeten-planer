"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { commentSchema } from "@/lib/validations"

export type CommentFormState = {
  error?: string
}

export async function addComment(
  activityId: string,
  _prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Nicht eingeloggt." }

  const parsed = commentSchema.safeParse({ text: formData.get("text") })
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.text?.[0] }
  }

  await prisma.comment.create({
    data: {
      activityId,
      userId: session.user.id,
      text: parsed.data.text,
    },
  })

  revalidatePath(`/activities/${activityId}`)
  return {}
}
