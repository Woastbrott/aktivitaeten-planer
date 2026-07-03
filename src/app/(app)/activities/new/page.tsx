import type { Metadata } from "next"

import { ActivityForm } from "@/components/activities/activity-form"

export const metadata: Metadata = { title: "Neue Aktivität – Sommer-Planer" }

export default function NewActivityPage() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 grid gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Aktivität vorschlagen
        </h1>
        <p className="text-sm text-muted-foreground">
          Erstelle eine neue Aktivität – du bist automatisch dabei.
        </p>
      </div>
      <ActivityForm />
    </div>
  )
}
