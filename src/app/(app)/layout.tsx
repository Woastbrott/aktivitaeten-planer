import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { SiteHeader } from "@/components/nav/site-header"
import { BottomNav } from "@/components/nav/bottom-nav"
import { getPendingCount } from "@/lib/pending-count"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const pendingCount = await getPendingCount(session.user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        user={{ name: session.user.name ?? "", username: session.user.username }}
        pendingCount={pendingCount}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:pb-10">
        {children}
      </main>
      <BottomNav pendingCount={pendingCount} />
    </div>
  )
}
