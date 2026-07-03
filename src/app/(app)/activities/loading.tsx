import { Skeleton } from "@/components/ui/skeleton"

export default function ActivitiesLoading() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-9 w-[170px]" />
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid gap-3 rounded-2xl border p-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="mt-1 flex items-center justify-between border-t pt-3">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
