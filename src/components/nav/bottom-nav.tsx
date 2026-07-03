"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NAV_ITEMS } from "@/components/nav/nav-items"
import { cn } from "@/lib/utils"

export function BottomNav({ pendingCount }: { pendingCount: number }) {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
      aria-label="Hauptnavigation"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4">
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
                "relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span className="relative">
                <item.icon className="size-5" />
                {item.href === "/activities" && pendingCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                    {pendingCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
