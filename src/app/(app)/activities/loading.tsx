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
        <Skeleton className="h-9 w-[170px] rounded-full" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
        <Skeleton className="h-9 w-full rounded-full lg:hidden" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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

        <Skeleton className="hidden h-[calc(100vh-6rem)] rounded-2xl lg:top-20 lg:block lg:sticky" />
      </div>
    </div>
  )
}
