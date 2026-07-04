import Link from "next/link"
import { Sun } from "lucide-react"

import { DesktopNav } from "@/components/nav/desktop-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { BrainrotToggle } from "@/components/brainrot-toggle"
import { BrainrotText } from "@/components/brainrot-text"
import { UserMenu } from "@/components/nav/user-menu"

export function SiteHeader({
  user,
  pendingCount,
}: {
  user: { name: string; username: string }
  pendingCount: number
}) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/activities"
          className="flex shrink-0 items-center gap-2 text-base font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sun className="size-4.5" />
          </span>
          <span className="hidden sm:inline">
            <BrainrotText>Sommer-Planer</BrainrotText>
          </span>
        </Link>

        <DesktopNav pendingCount={pendingCount} />

        <div className="flex items-center gap-1">
          <BrainrotToggle />
          <ThemeToggle />
          <UserMenu name={user.name} username={user.username} />
        </div>
      </div>
    </header>
  )
}
