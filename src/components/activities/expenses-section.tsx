"use client"

import { useTransition } from "react"
import { ArrowRight, Receipt, Trash2, Wallet } from "lucide-react"
import { toast } from "sonner"

import { deleteExpense } from "@/lib/actions/expenses"
import { Button } from "@/components/ui/button"
import { computeBalances, formatEuro, settleDebts } from "@/lib/settle-debts"
import { ExpenseForm } from "@/components/activities/expense-form"
import { initials } from "@/lib/initials"
import { cn } from "@/lib/utils"
import type { ActivityDetail } from "@/lib/types"

export function ExpensesSection({
  activityId,
  expenses,
  goingParticipants,
  currentUserId,
}: {
  activityId: string
  expenses: ActivityDetail["expenses"]
  goingParticipants: { id: string; name: string }[]
  currentUserId: string
}) {
  const [isPending, startTransition] = useTransition()

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const balances = computeBalances(
    expenses.map((e) => ({ amount: e.amount, paidById: e.paidById })),
    goingParticipants.map((p) => p.id)
  )
  const settlements = settleDebts(balances)
  const nameById = new Map(goingParticipants.map((p) => [p.id, p.name]))

  function handleDelete(expenseId: string) {
    startTransition(async () => {
      try {
        await deleteExpense(activityId, expenseId)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Ausgabe konnte nicht gelöscht werden."
        )
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
                <div className="flex items-center gap-1">
                  <span className="mr-1 font-medium tabular-nums">
                    {formatEuro(expense.amount)}
                  </span>
                  {expense.createdById === currentUserId && (
                    <>
                      <ExpenseForm
                        activityId={activityId}
                        participants={goingParticipants}
                        expense={{
                          id: expense.id,
                          title: expense.title,
                          amount: expense.amount,
                          paidById: expense.paidById,
                        }}
                      />
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
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {goingParticipants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sobald Personen zugesagt haben, wird hier die Aufteilung angezeigt.
            </p>
          ) : (
            <div className="grid gap-1.5 rounded-lg border p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Kostenübersicht
              </p>
              {balances.map((balance) => (
                <div
                  key={balance.userId}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground">
                    {initials(nameById.get(balance.userId) ?? "?")}
                  </span>
                  <span className="truncate">{nameById.get(balance.userId)}</span>
                  <span className="text-xs text-muted-foreground">
                    bezahlt {formatEuro(balance.paid)} · Anteil {formatEuro(balance.share)}
                  </span>
                  <span
                    className={cn(
                      "ml-auto shrink-0 font-medium tabular-nums",
                      balance.net > 0 && "text-emerald-600 dark:text-emerald-400",
                      balance.net < 0 && "text-destructive"
                    )}
                  >
                    {balance.net > 0
                      ? `bekommt ${formatEuro(balance.net)}`
                      : balance.net < 0
                        ? `schuldet ${formatEuro(-balance.net)}`
                        : "ausgeglichen"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {settlements.length > 0 && (
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
