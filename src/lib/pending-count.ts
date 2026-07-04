import { prisma } from "@/lib/prisma"

// Activity dates are stored as plain wall-clock values with no timezone
// (whatever the person typed), so comparisons must use "now" expressed the
// same way — Europe/Berlin wall-clock time relabeled as UTC — instead of the
// real UTC instant. Using `new Date()` directly would shift the cutoff by
// the CET/CEST offset and mark already-past activities as still upcoming
// (or the reverse) for up to two hours around the boundary.
function nowInStorageConvention(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date())

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)

  return new Date(
    Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
      get("second")
    )
  )
}

export async function getPendingCount(userId: string): Promise<number> {
  return prisma.activity.count({
    where: {
      OR: [{ date: null }, { date: { gte: nowInStorageConvention() } }],
      participations: { none: { userId } },
      createdById: { not: userId },
    },
  })
}
