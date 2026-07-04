"use client"

import { toast } from "sonner"

import { useBrainrot } from "@/components/brainrot-provider"
import { Button } from "@/components/ui/button"

export function BrainrotToggle() {
  const { active, toggle } = useBrainrot()

  function handleClick() {
    toggle()
    if (!active) {
      toast.success("SKIBIDI BRAINROT MODE ACTIVATED 🚽🔥🧠", {
        description: "Tung tung tung tung tung tung sahur.",
      })
    } else {
      toast("Brainrot deaktiviert.", { description: "zurück zur Ohio-freien Zone 🙏" })
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Brainrot-Modus umschalten"
      title="Brainrot-Modus"
      onClick={handleClick}
      className={active ? "bg-primary/10 text-primary" : undefined}
    >
      <span aria-hidden className="text-base">🚽</span>
    </Button>
  )
}
