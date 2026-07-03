import { CalendarDays, ListChecks, PlusCircle, UserPlus } from "lucide-react"

export const NAV_ITEMS = [
  { href: "/activities", label: "Aktivitäten", icon: ListChecks },
  { href: "/activities/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/activities/new", label: "Neu", icon: PlusCircle },
  { href: "/invite", label: "Einladen", icon: UserPlus },
] as const
