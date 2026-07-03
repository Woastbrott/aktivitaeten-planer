import Link from "next/link"
import type { Metadata } from "next"

import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Registrieren – Sommer-Planer" }

export default function RegisterPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-1.5 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Konto erstellen</h1>
        <p className="text-sm text-muted-foreground">
          Werde Teil der Gruppe und plane Sommer-Aktivitäten mit.
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Schon dabei?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Anmelden
        </Link>
      </p>
    </div>
  )
}
