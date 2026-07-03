import Link from "next/link"
import { Sun } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--color-secondary),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 -z-10 size-72 rounded-full bg-accent/60 blur-3xl"
      />
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sun className="size-5" />
          </span>
          Sommer-Planer
        </Link>
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
