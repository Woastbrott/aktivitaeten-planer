"use client"

import { useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    })

    setIsPending(false)

    if (result?.error) {
      setError("Nutzername oder Passwort ist falsch.")
      return
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/activities"
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="username">Nutzername</Label>
        <Input
          id="username"
          name="username"
          placeholder="dein-name"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Passwort</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending && <Loader2 className="animate-spin" />}
        Anmelden
      </Button>
    </form>
  )
}
