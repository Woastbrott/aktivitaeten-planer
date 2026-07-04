"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { carpoolSchema } from "@/lib/validations"

export type CarpoolFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function createCarpool(
  activityId: string,
  _prevState: CarpoolFormState,
  formData: FormData
): Promise<CarpoolFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Nicht eingeloggt." }

  const rawSeats = formData.get("seats")
  const rawTime = formData.get("departureTime")

  const parsed = carpoolSchema.safeParse({
    seats: rawSeats ? Number(rawSeats) : NaN,
    departureTime: rawTime || null,
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const existing = await prisma.carpool.findFirst({
    where: { activityId, driverId: session.user.id },
  })
  if (existing) {
    return { error: "Du bietest für diese Aktivität bereits eine Fahrgemeinschaft an." }
  }

  await prisma.carpool.create({
    data: {
      activityId,
      driverId: session.user.id,
      seats: parsed.data.seats,
      departureTime: parsed.data.departureTime
        ? new Date(parsed.data.departureTime)
        : null,
    },
  })

  revalidatePath(`/activities/${activityId}`)
  return {}
}

export async function joinCarpool(activityId: string, carpoolId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")
  const userId = session.user.id

  // Wrapped in a transaction with a fresh capacity check right before the
  // insert, so two people clicking "Mitfahren" on the last seat at the same
  // time can't both get in (the earlier check-then-upsert was racy).
  await prisma.$transaction(async (tx) => {
    const carpool = await tx.carpool.findUnique({
      where: { id: carpoolId },
      include: { passengers: true },
    })
    if (!carpool) throw new Error("Fahrgemeinschaft nicht gefunden.")
    if (carpool.driverId === userId) {
      throw new Error("Du bist bereits Fahrer:in dieser Fahrgemeinschaft.")
    }
    const alreadyIn = carpool.passengers.some((p) => p.userId === userId)
    if (!alreadyIn && carpool.passengers.length >= carpool.seats) {
      throw new Error("Keine Plätze mehr frei.")
    }

    await tx.carpoolPassenger.upsert({
      where: {
        carpoolId_userId: { carpoolId, userId },
      },
      create: { carpoolId, userId },
      update: {},
    })
  }, { isolationLevel: "Serializable" })

  revalidatePath(`/activities/${activityId}`)
}

export async function leaveCarpool(activityId: string, carpoolId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")

  await prisma.carpoolPassenger.deleteMany({
    where: { carpoolId, userId: session.user.id },
  })

  revalidatePath(`/activities/${activityId}`)
}

export async function deleteCarpool(activityId: string, carpoolId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")

  await prisma.carpool.deleteMany({
    where: { id: carpoolId, driverId: session.user.id },
  })

  revalidatePath(`/activities/${activityId}`)
}
