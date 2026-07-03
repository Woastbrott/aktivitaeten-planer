"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { expenseSchema } from "@/lib/validations"

export type ExpenseFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function addExpense(
  activityId: string,
  _prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Nicht eingeloggt." }

  const rawAmount = formData.get("amount")

  const parsed = expenseSchema.safeParse({
    title: formData.get("title"),
    amount: rawAmount ? Number(rawAmount) : NaN,
    paidById: formData.get("paidById"),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  await prisma.expense.create({
    data: {
      activityId,
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

  await prisma.expense.delete({ where: { id: expenseId } })

  revalidatePath(`/activities/${activityId}`)
}
