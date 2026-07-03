"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CopyInviteLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${token}`
      : `/invite/${token}`

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <Input readOnly value={url} className="font-mono text-xs sm:text-sm" />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={copy}
        aria-label="Link kopieren"
        className="shrink-0"
      >
        {copied ? <Check className="text-primary" /> : <Copy />}
      </Button>
    </div>
  )
}
