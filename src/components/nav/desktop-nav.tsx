"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NAV_ITEMS } from "@/components/nav/nav-items"
import { cn } from "@/lib/utils"

export function DesktopNav({ pendingCount }: { pendingCount: number }) {
  const pathname = usePathname()

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/activities"
            ? pathname === "/activities"
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
            {item.href === "/activities" && pendingCount > 0 && (
              <span className="ml-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {pendingCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
