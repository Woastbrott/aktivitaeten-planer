"use client"

import { useTransition } from "react"
import { ArrowRight, Receipt, Trash2, Wallet } from "lucide-react"
import { toast } from "sonner"

import { deleteExpense } from "@/lib/actions/expenses"
import { Button } from "@/components/ui/button"
import { formatEuro, settleDebts } from "@/lib/settle-debts"
import { ExpenseForm } from "@/components/activities/expense-form"
import { initials } from "@/lib/initials"
import type { ActivityDetail } from "@/lib/types"

export function ExpensesSection({
  activityId,
  expenses,
  goingParticipants,
}: {
  activityId: string
  expenses: ActivityDetail["expenses"]
  goingParticipants: { id: string; name: string }[]
}) {
  const [isPending, startTransition] = useTransition()

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const settlements = settleDebts(
    expenses.map((e) => ({ amount: e.amount, paidById: e.paidById })),
    goingParticipants.map((p) => p.id)
  )
  const nameById = new Map(goingParticipants.map((p) => [p.id, p.name]))

  function handleDelete(expenseId: string) {
    startTransition(async () => {
      try {
        await deleteExpense(activityId, expenseId)
      } catch {
        toast.error("Ausgabe konnte nicht gelöscht werden.")
      }
    })
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Wallet className="size-4.5" />
          Kosten
          {total > 0 && (
            <span className="font-normal text-muted-foreground">
              · {formatEuro(total)} gesamt
            </span>
          )}
        </h2>
        <ExpenseForm activityId={activityId} participants={goingParticipants} />
      </div>

      {expenses.length === 0 ? (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Receipt className="size-4" />
          Noch keine Ausgaben erfasst.
        </p>
      ) : (
        <>
          <ul className="grid gap-2">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <div className="grid gap-0.5">
                  <span className="font-medium">{expense.title}</span>
                  <span className="text-xs text-muted-foreground">
                    bezahlt von {expense.paidBy.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">
                    {formatEuro(expense.amount)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={isPending}
                    onClick={() => handleDelete(expense.id)}
                    aria-label="Ausgabe löschen"
                  >
                    <Trash2 className="text-muted-foreground" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {goingParticipants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sobald Personen zugesagt haben, wird hier die Aufteilung angezeigt.
            </p>
          ) : settlements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Alle Kosten sind bereits ausgeglichen.
            </p>
          ) : (
            <div className="grid gap-1.5 rounded-lg bg-secondary/40 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Wer schuldet wem
              </p>
              {settlements.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm"
                  title={`${nameById.get(s.fromId)} → ${nameById.get(s.toId)}`}
                >
                  <span className="flex size-6 items-center justify-center rounded-full bg-background text-[10px] font-medium">
                    {initials(nameById.get(s.fromId) ?? "?")}
                  </span>
                  <span>{nameById.get(s.fromId)}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                  <span>{nameById.get(s.toId)}</span>
                  <span className="ml-auto font-medium tabular-nums">
                    {formatEuro(s.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
