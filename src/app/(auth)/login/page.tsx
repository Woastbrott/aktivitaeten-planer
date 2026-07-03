import Link from "next/link"
import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Anmelden – Sommer-Planer" }

export default function LoginPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-1.5 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Willkommen zurück
        </h1>
        <p className="text-sm text-muted-foreground">
          Melde dich an, um Sommer-Aktivitäten zu planen.
        </p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Noch kein Konto?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Registrieren
        </Link>
      </p>
    </div>
  )
}
