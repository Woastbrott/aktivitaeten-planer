import type { Metadata } from "next"
import { UserPlus } from "lucide-react"

import { getOrCreateInvite } from "@/lib/actions/invites"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyInviteLink } from "@/components/invite/copy-invite-link"

export const metadata: Metadata = { title: "Einladen – Sommer-Planer" }

export default async function InvitePage() {
  const token = await getOrCreateInvite()

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 grid gap-1.5">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <UserPlus className="size-6 text-primary" />
          Freunde einladen
        </h1>
        <p className="text-sm text-muted-foreground">
          Teile diesen Link, damit neue Freunde der Gruppe beitreten können.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dein Einladungslink</CardTitle>
          <CardDescription>
            Jeder mit diesem Link kann sich direkt registrieren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CopyInviteLink token={token} />
        </CardContent>
      </Card>
    </div>
  )
}
