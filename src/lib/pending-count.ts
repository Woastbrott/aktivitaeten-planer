import { prisma } from "@/lib/prisma"

export async function getPendingCount(userId: string): Promise<number> {
  return prisma.activity.count({
    where: {
      OR: [{ date: null }, { date: { gte: new Date() } }],
      participations: { none: { userId } },
      createdById: { not: userId },
    },
  })
}
