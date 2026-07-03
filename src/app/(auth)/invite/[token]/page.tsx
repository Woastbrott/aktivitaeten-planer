import type { Metadata } from "next"

import { getInviteByToken } from "@/lib/actions/invites"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Einladung – Sommer-Planer" }

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const invite = await getInviteByToken(token)

  return (
    <div className="grid gap-6">
      <div className="grid gap-1.5 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Du bist eingeladen!
        </h1>
        <p className="text-sm text-muted-foreground">
          {invite
            ? `${invite.createdBy.name} lädt dich zum Sommer-Planer ein. Erstelle ein Konto, um mitzuplanen.`
            : "Erstelle ein Konto, um der Gruppe beizutreten."}
        </p>
      </div>

      <RegisterForm inviteToken={token} />
    </div>
  )
}
