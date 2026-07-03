"use client"

import { useActionState, useEffect, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"

import { registerUser, type RegisterState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: RegisterState = {}

export function RegisterForm({ inviteToken }: { inviteToken?: string }) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState
  )
  // React resets the form's fields once the action succeeds, so the
  // submitted credentials must be captured before that happens.
  const credentialsRef = useRef<{ email: string; password: string } | null>(
    null
  )

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    credentialsRef.current = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    }
  }

  useEffect(() => {
    if (!state.success || !credentialsRef.current) return

    const { email, password } = credentialsRef.current
    signIn("credentials", { email, password, redirect: false }).then(() => {
      router.push("/activities")
      router.refresh()
    })
  }, [state.success, router])

  return (
    <form action={formAction} onSubmit={handleSubmit} className="grid gap-4">
      {inviteToken && (
        <input type="hidden" name="inviteToken" value={inviteToken} />
      )}

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Deine Name" required />
        {state.fieldErrors?.name && (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="du@beispiel.de"
          required
        />
        {state.fieldErrors?.email && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Passwort</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Mind. 8 Zeichen"
          required
        />
        {state.fieldErrors?.password && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending && <Loader2 className="animate-spin" />}
        Konto erstellen
      </Button>
    </form>
  )
}
