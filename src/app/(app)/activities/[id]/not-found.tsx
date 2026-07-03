import { CalendarSearch } from "lucide-react"

import { EmptyState } from "@/components/empty-state"

export default function ActivityNotFound() {
  return (
    <div className="mx-auto max-w-lg">
      <EmptyState
        icon={CalendarSearch}
        title="Aktivität nicht gefunden"
        description="Diese Aktivität existiert nicht mehr oder wurde entfernt."
        actionLabel="Zu den Aktivitäten"
        actionHref="/activities"
      />
    </div>
  )
}
