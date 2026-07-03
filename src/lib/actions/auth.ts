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
    email: formData.get("email"),
    password: formData.get("password"),
    inviteToken: formData.get("inviteToken") || undefined,
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Diese E-Mail-Adresse ist bereits registriert." }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name, email, passwordHash },
  })

  return { success: true }
}
