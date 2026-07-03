import type { Prisma } from "@prisma/client"

export const activityListInclude = {
  participations: {
    include: { user: { select: { id: true, name: true } } },
  },
  createdBy: { select: { id: true, name: true } },
  images: { orderBy: { createdAt: "asc" }, take: 1 },
} satisfies Prisma.ActivityInclude

export type ActivityListItem = Prisma.ActivityGetPayload<{
  include: typeof activityListInclude
}>

export const activityDetailInclude = {
  participations: {
    include: { user: { select: { id: true, name: true } } },
  },
  createdBy: { select: { id: true, name: true } },
  comments: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  },
  expenses: {
    include: { paidBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  },
  carpools: {
    include: {
      driver: { select: { id: true, name: true } },
      passengers: { include: { user: { select: { id: true, name: true } } } },
    },
  },
  images: { orderBy: { createdAt: "asc" } },
} satisfies Prisma.ActivityInclude

export type ActivityDetail = Prisma.ActivityGetPayload<{
  include: typeof activityDetailInclude
}>
