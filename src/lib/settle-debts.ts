export type ExpenseInput = {
  amount: number // cents
  paidById: string
}

export type Balance = {
  userId: string
  paid: number // cents this person paid in total
  share: number // cents this person owes as their equal share
  net: number // paid - share; positive = should receive, negative = owes
}

export type Settlement = {
  fromId: string
  toId: string
  amount: number // cents
}

/**
 * Splits the total of all expenses evenly across participantIds and
 * returns each person's paid/share/net balance. Payers who aren't in
 * participantIds (shouldn't happen via the UI, but handled defensively)
 * are included with share 0, since they don't owe a portion themselves.
 */
export function computeBalances(
  expenses: ExpenseInput[],
  participantIds: string[]
): Balance[] {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const share = participantIds.length > 0 ? Math.floor(total / participantIds.length) : 0
  const remainder = participantIds.length > 0 ? total - share * participantIds.length : 0

  const shareById = new Map<string, number>()
  for (const id of participantIds) shareById.set(id, share)

  // distribute rounding remainder (1 cent each) deterministically
  participantIds
    .slice()
    .sort()
    .slice(0, remainder)
    .forEach((id) => shareById.set(id, (shareById.get(id) ?? 0) + 1))

  const paidById = new Map<string, number>()
  for (const id of participantIds) paidById.set(id, 0)
  for (const expense of expenses) {
    paidById.set(expense.paidById, (paidById.get(expense.paidById) ?? 0) + expense.amount)
    if (!shareById.has(expense.paidById)) shareById.set(expense.paidById, 0)
  }

  const allIds = new Set([...shareById.keys(), ...paidById.keys()])

  return Array.from(allIds).map((userId) => {
    const paid = paidById.get(userId) ?? 0
    const personShare = shareById.get(userId) ?? 0
    return { userId, paid, share: personShare, net: paid - personShare }
  })
}

/**
 * Derives a minimal set of payments that settles all balances (greedy
 * largest-debtor vs largest-creditor matching).
 */
export function settleDebts(balances: Balance[]): Settlement[] {
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ id: b.userId, amount: -b.net }))
  const creditors = balances
    .filter((b) => b.net > 0)
    .map((b) => ({ id: b.userId, amount: b.net }))

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
