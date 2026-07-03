import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon className="size-6" />
      </span>
      <div className="grid gap-1">
        <p className="font-medium">{title}</p>
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Button asChild className="mt-2">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
