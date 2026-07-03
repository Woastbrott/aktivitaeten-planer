"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { expenseSchema } from "@/lib/validations"

export type ExpenseFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

function parseExpenseForm(formData: FormData) {
  const rawAmount = formData.get("amount")

  return expenseSchema.safeParse({
    title: formData.get("title"),
    amount: rawAmount ? Number(rawAmount) : NaN,
    paidById: formData.get("paidById"),
  })
}

export async function addExpense(
  activityId: string,
  _prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Nicht eingeloggt." }

  const parsed = parseExpenseForm(formData)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  await prisma.expense.create({
    data: {
      activityId,
      title: parsed.data.title,
      amount: Math.round(parsed.data.amount * 100),
      paidById: parsed.data.paidById,
      createdById: session.user.id,
    },
  })

  revalidatePath(`/activities/${activityId}`)
  return {}
}

export async function updateExpense(
  activityId: string,
  expenseId: string,
  _prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Nicht eingeloggt." }

  const expense = await prisma.expense.findUnique({ where: { id: expenseId } })
  if (!expense || expense.activityId !== activityId) {
    return { error: "Ausgabe nicht gefunden." }
  }
  if (expense.createdById !== session.user.id) {
    return { error: "Nur die erfassende Person kann diese Ausgabe bearbeiten." }
  }

  const parsed = parseExpenseForm(formData)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  await prisma.expense.update({
    where: { id: expenseId },
    data: {
      title: parsed.data.title,
      amount: Math.round(parsed.data.amount * 100),
      paidById: parsed.data.paidById,
    },
  })

  revalidatePath(`/activities/${activityId}`)
  return {}
}

export async function deleteExpense(activityId: string, expenseId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Nicht eingeloggt.")

  const expense = await prisma.expense.findUnique({ where: { id: expenseId } })
  if (!expense || expense.activityId !== activityId) {
    throw new Error("Ausgabe nicht gefunden.")
  }
  if (expense.createdById !== session.user.id) {
    throw new Error("Nur die erfassende Person kann diese Ausgabe löschen.")
  }

  await prisma.expense.delete({ where: { id: expenseId } })

  revalidatePath(`/activities/${activityId}`)
}
