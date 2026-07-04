"use client"

import { useState, useTransition, type FormEvent } from "react"
import { Loader2, Pencil, Plus } from "lucide-react"
import { toast } from "sonner"

import {
  addExpense,
  updateExpense,
  type ExpenseFormState,
} from "@/lib/actions/expenses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ExpenseFormProps = {
  activityId: string
  participants: { id: string; name: string }[]
  expense?: { id: string; title: string; amount: number; paidById: string }
}

export function ExpenseForm({ activityId, participants, expense }: ExpenseFormProps) {
  const isEdit = !!expense
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<ExpenseFormState>({})
  const [isPending, startTransition] = useTransition()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget

    startTransition(async () => {
      const result = isEdit
        ? await updateExpense(activityId, expense.id, {}, formData)
        : await addExpense(activityId, {}, formData)

      if (result.error || result.fieldErrors) {
        setState(result)
      } else {
        setState({})
        form.reset()
        setOpen(false)
        toast.success(isEdit ? "Ausgabe aktualisiert." : "Ausgabe hinzugefügt.")
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setState({})
      }}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Ausgabe bearbeiten"
          >
            <Pencil className="text-muted-foreground" />
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm">
            <Plus />
            Ausgabe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Ausgabe bearbeiten" : "Ausgabe hinzufügen"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          {state.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="expense-title">Titel</Label>
            <Input
              id="expense-title"
              name="title"
              placeholder="z. B. Verpflegung"
              defaultValue={expense?.title}
              required
            />
            {state.fieldErrors?.title && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.title[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expense-amount">Betrag (€)</Label>
            <Input
              id="expense-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              defaultValue={expense ? (expense.amount / 100).toFixed(2) : undefined}
              required
            />
            {state.fieldErrors?.amount && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.amount[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expense-paidBy">Wer hat bezahlt?</Label>
            <Select name="paidById" defaultValue={expense?.paidById} required>
              <SelectTrigger id="expense-paidBy" className="w-full">
                <SelectValue placeholder="Person auswählen" />
              </SelectTrigger>
              <SelectContent>
                {participants.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.fieldErrors?.paidById && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.paidById[0]}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {isEdit ? "Speichern" : "Hinzufügen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
