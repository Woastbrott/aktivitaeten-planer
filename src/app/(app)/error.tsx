"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <p className="font-medium">Etwas ist schiefgelaufen</p>
      <p className="text-sm text-muted-foreground">
        Die Seite konnte nicht geladen werden. Versuche es noch einmal.
      </p>
      <Button onClick={reset} className="mt-2">
        Erneut versuchen
      </Button>
    </div>
  )
}
