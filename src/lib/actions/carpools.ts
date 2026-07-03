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

  const parsed = carpoolSchema.safeParse({
    seats: rawSeats ? Number(rawSeats) : NaN,
    departureLocation: formData.get("departureLocation"),
    departureTime: formData.get("departureTime"),
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
      departureLocation: parsed.data.departureLocation,
      departureTime: new Date(parsed.data.departureTime),
    },
  })

  revalidatePath(`/activities/${activityId}`)
  return {}
}

export async function joinCarpool(activityId: string, carpoolId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")

  const carpool = await prisma.carpool.findUnique({
    where: { id: carpoolId },
    include: { passengers: true },
  })
  if (!carpool) throw new Error("Fahrgemeinschaft nicht gefunden.")
  if (carpool.driverId === session.user.id) {
    throw new Error("Du bist bereits Fahrer:in dieser Fahrgemeinschaft.")
  }
  if (carpool.passengers.length >= carpool.seats) {
    throw new Error("Keine Plätze mehr frei.")
  }

  await prisma.carpoolPassenger.upsert({
    where: {
      carpoolId_userId: { carpoolId, userId: session.user.id },
    },
    create: { carpoolId, userId: session.user.id },
    update: {},
  })

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
