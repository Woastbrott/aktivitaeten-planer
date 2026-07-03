import { Skeleton } from "@/components/ui/skeleton"

export default function ActivityDetailLoading() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}
