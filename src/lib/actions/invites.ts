"use server"

import { randomBytes } from "crypto"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getOrCreateInvite(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt")

  const existing = await prisma.invite.findFirst({
    where: { createdById: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  if (existing) return existing.token

  const token = randomBytes(16).toString("hex")
  const invite = await prisma.invite.create({
    data: { token, createdById: session.user.id },
  })

  return invite.token
}

export async function getInviteByToken(token: string) {
  return prisma.invite.findUnique({
    where: { token },
    include: { createdBy: { select: { name: true } } },
  })
}
