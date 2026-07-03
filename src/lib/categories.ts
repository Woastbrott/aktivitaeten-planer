import type { ActivityCategory } from "@prisma/client"
import {
  Mountain,
  Waves,
  Flame,
  Music,
  Trophy,
  Palette,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  WANDERN: "Wandern",
  BADEN: "Baden",
  GRILLEN: "Grillen",
  FESTIVAL: "Festival",
  SPORT: "Sport",
  KULTUR: "Kultur",
  SONSTIGES: "Sonstiges",
}

export const CATEGORY_ICONS: Record<ActivityCategory, LucideIcon> = {
  WANDERN: Mountain,
  BADEN: Waves,
  GRILLEN: Flame,
  FESTIVAL: Music,
  SPORT: Trophy,
  KULTUR: Palette,
  SONSTIGES: Sparkles,
}

export const CATEGORY_STYLES: Record<ActivityCategory, string> = {
  WANDERN:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  BADEN: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  GRILLEN:
    "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  FESTIVAL:
    "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300",
  SPORT: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  KULTUR:
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  SONSTIGES:
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
}

export const CATEGORY_OPTIONS = Object.keys(
  CATEGORY_LABELS
) as ActivityCategory[]
