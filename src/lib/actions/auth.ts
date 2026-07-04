"use server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"

export type RegisterState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    password: formData.get("password"),
    inviteToken: formData.get("inviteToken") || undefined,
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { name, username, password, inviteToken } = parsed.data

  if (!inviteToken) {
    return {
      error:
        "Für die Registrierung wird ein Einladungslink benötigt. Frag ein bestehendes Mitglied nach einer Einladung.",
    }
  }

  const invite = await prisma.invite.findUnique({ where: { token: inviteToken } })
  if (!invite || (invite.expiresAt && invite.expiresAt < new Date())) {
    return { error: "Dieser Einladungslink ist ungültig oder abgelaufen." }
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    return { error: "Dieser Nutzername ist bereits vergeben." }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name, username, passwordHash },
  })

  return { success: true }
}
