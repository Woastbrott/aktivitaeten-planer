import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarLoading() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-[560px] w-full rounded-2xl" />
    </div>
  )
}
