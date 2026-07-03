export type ExpenseInput = {
  amount: number // cents
  paidById: string
}

export type Settlement = {
  fromId: string
  toId: string
  amount: number // cents
}

/**
 * Splits all expenses evenly across participantIds and returns a minimal
 * set of payments that settles all balances (greedy largest-debtor vs
 * largest-creditor matching).
 */
export function settleDebts(
  expenses: ExpenseInput[],
  participantIds: string[]
): Settlement[] {
  if (participantIds.length === 0) return []

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  if (total === 0) return []

  const share = Math.floor(total / participantIds.length)
  const remainder = total - share * participantIds.length

  // balance > 0 means this person is owed money, < 0 means they owe money
  const balances = new Map<string, number>()
  for (const id of participantIds) balances.set(id, -share)

  // distribute rounding remainder (1 cent each) deterministically
  participantIds
    .slice()
    .sort()
    .slice(0, remainder)
    .forEach((id) => balances.set(id, (balances.get(id) ?? 0) - 1))

  for (const expense of expenses) {
    if (!balances.has(expense.paidById)) balances.set(expense.paidById, 0)
    balances.set(
      expense.paidById,
      (balances.get(expense.paidById) ?? 0) + expense.amount
    )
  }

  const debtors: { id: string; amount: number }[] = []
  const creditors: { id: string; amount: number }[] = []

  for (const [id, balance] of balances.entries()) {
    if (balance < 0) debtors.push({ id, amount: -balance })
    else if (balance > 0) creditors.push({ id, amount: balance })
  }

  debtors.sort((a, b) => b.amount - a.amount)
  creditors.sort((a, b) => b.amount - a.amount)

  const settlements: Settlement[] = []
  let i = 0
  let j = 0

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const amount = Math.min(debtor.amount, creditor.amount)

    if (amount > 0) {
      settlements.push({ fromId: debtor.id, toId: creditor.id, amount })
    }

    debtor.amount -= amount
    creditor.amount -= amount

    if (debtor.amount === 0) i++
    if (creditor.amount === 0) j++
  }

  return settlements
}

export function formatEuro(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  })
}
